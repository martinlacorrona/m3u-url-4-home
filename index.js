const fs = require('fs')
const axios = require('axios').default
const express = require('express')
const { exit } = require('process')
const app = express()

require('dotenv').config()

// LOAD URL
let url = process.env.URL
if(url == undefined) {
    console.error("[M3U URL 4 HOME] You should define URL value on .env file (if it's not exits, create it)")
    exit()
}

// REGEX PATTERN
let regexPatter = undefined
if(process.env.REGEX_PATTERN != null) {
    regexPatter = new RegExp(process.env.REGEX_PATTERN)
} else {
    console.log("[M3U URL 4 HOME] You don't have defined an regex pattern on .env file. You can add a new line with REGEX_PATTERN='pattern here'.")
}

app.get('/', async function (req, res) {
    console.log("[M3U URL 4 HOME] Processing request...")
    if(regexPatter == undefined) {
        console.log("[M3U URL 4 HOME] Not regex pattern defined, redirect to URL defined.")
        res.redirect(url)
        return
    }

    console.time('[M3U URL 4 HOME] Time elapsed')
    try {
        var reponse = await axios.get(url)
        var arrayFromServer = await reponse.data.split("\r\n")
        var fileText = "#EXTM3U\n" //Head of file
            arrayFromServer.forEach((element, index) => {
                if(regexPatter.test(element)) {
                    fileText += element + "\n"
                    fileText += arrayFromServer[index + 1] + "\n"
                }
            })
        fs.writeFile("./list.m3u", fileText, function(err) {
            console.log(`[M3U URL 4 HOME] Sending ${(fileText.split(/\r\n|\r|\n/).length - 1) / 2} channels and movies.`)
            console.timeEnd('[M3U URL 4 HOME] Time elapsed')
            res.download("./list.m3u")
        })
    } catch(error) {
        console.error(`[M3U URL 4 HOME] Error getting data from URL defined. Error message: ${error.message}`)
        console.timeEnd('[M3U URL 4 HOME] Time elapsed')
        res.status(500)
        res.send("ERROR GETTING LIST FROM URL")
    }
})

app.listen(process.env.PORT || 3000, function(err) {
    if(err) console.log(`[M3U URL 4 HOME] Error starting server at ${process.env.PORT || 3000}`)
    else console.log(`[M3U URL 4 HOME] Server start correctly at ${process.env.PORT || 3000}`)
})