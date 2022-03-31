const fs = require('fs')
const axios = require('axios').default
const {performance} = require('perf_hooks');
const configUtils = require("../utils/configUtils.js")

function rootRoute(app, logger) {
    app.get('/', async function (req, res) {
        logger.debug("Processing request...")
        configUtils.updateEnv(logger)
    
        let regexPattern = configUtils.getRegex()
        let url = configUtils.getUrl()

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

module.exports = {rootRoute}