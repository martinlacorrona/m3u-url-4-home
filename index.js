const fs = require('fs')
const request = require('request')
const express = require('express')
const app = express()

require('dotenv').config()

let patternSpain = /#.*ES.*/gm

app.get('/', function (req, res) {
    console.log("[M3U URL 4 HOME] Request recieved")
    console.time('perfomanceFunctions')
    request(process.env.URL, function (error, response, body) {
        var arrayFromServer = body.split("\r\n");
        var myArray = "#EXTM3U\n"
        arrayFromServer.forEach((element, index) => {
            if(patternSpain.test(element)) {
                myArray += element + "\n"
                myArray += arrayFromServer[index + 1] + "\n"
            }
        });
        fs.writeFile("./list.m3u", myArray, function(err) {
            console.log(`[M3U URL 4 HOME] Founded and sending ${myArray.split(/\r\n|\r|\n/).length / 2} channels and movies.`)
            console.timeEnd('perfomanceFunctions')
            res.download("./list.m3u")
        })
    });
})

app.listen(process.env.PORT || 3000, function(err) {
    if(err) console.log(`[M3U URL 4 HOME] Error starting server at ${process.env.PORT || 3000}`)
    else console.log(`[M3U URL 4 HOME] Server start correctly at ${process.env.PORT || 3000}`)
});