const fs = require('fs')
const axios = require('axios').default
const { exit } = require('process')
const {performance} = require('perf_hooks');

function rootRoute(app, logger) {
    app.get('/', async function (req, res) {
        logger.debug("Processing request...")
        updateEnv(logger)
    
        if(regexPattern == undefined) {
            logger.debug("Not regex pattern defined, redirect to URL defined.")
            res.redirect(url)
            return
        }

        startTime = performance.now()
        try {
            var reponse = await axios.get(url)
            var arrayFromServer = await reponse.data.split("\r\n")
            var fileText = "#EXTM3U\n" //Head of file
                arrayFromServer.forEach((element, index) => {
                    if(regexPattern.test(element)) {
                        fileText += element + "\n"
                        fileText += arrayFromServer[index + 1] + "\n"
                    }
                })
            fs.writeFile("./list.m3u", fileText, function(err) {
                finishTime = performance.now()
                logger.debug(`Sending ${(fileText.split(/\r\n|\r|\n/).length - 1) / 2} channels and movies. Time elapsed: ${((finishTime - startTime)/1000.0).toFixed(3)}s`)
                res.download("./list.m3u")
            })
        } catch(error) {
            logger.error(`Error getting data from URL defined. Error message: ${error.message}`)
            console.timeEnd('Time elapsed')
            res.status(500)
            res.send("ERROR GETTING LIST FROM URL")
        }
    })
}

function updateEnv(logger) {
    delete process.env.URL
    delete process.env.REGEX_PATTERN
    require('dotenv').config()

    // LOAD URL
    url = process.env.URL
    if(url == undefined) {
        logger.error("You should define URL value on .env file (if it's not exits, create it)")
        exit()
    }
    
    // REGEX PATTERN
    if(process.env.REGEX_PATTERN != null) {
        regexPattern = new RegExp(process.env.REGEX_PATTERN)
    } else {
        logger.debug("You don't have defined an regex pattern on .env file. You can add a new line with REGEX_PATTERN='pattern here'.")
    }
}

module.exports = {rootRoute, updateEnv}