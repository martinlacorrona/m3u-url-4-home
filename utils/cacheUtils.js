const fs = require('fs')
const fileName = '../lastUpdate.json';
const file = require(fileName);
const axios = require('axios').default
const {performance} = require('perf_hooks');
const configUtils = require("./configUtils.js")

function sendFile(res) {
    res.download("./list.m3u")
}

async function updateCache(logger) {
    logger.debug("[CACHE] Updating cache...")
    configUtils.updateConfig(logger)

    let regexPattern = configUtils.getRegex()
    let url = configUtils.getUrl()

    try {
        startTime = performance.now()
        var reponse = await axios.get(url)
        var arrayFromServer = await reponse.data.split("\r\n")
        var fileText = ""
        if(regexPattern == undefined) { //not regex
            fileText = await reponse.data
        } else { //apply regex
            fileText = "#EXTM3U\n" //Head of file
            arrayFromServer.forEach((element, index) => {
                if(regexPattern.test(element)) {
                    fileText += element + "\n"
                    fileText += arrayFromServer[index + 1] + "\n"
                }
            })
        }
        fs.writeFile("./list.m3u", fileText, function(err) {
            finishTime = performance.now()
            logger.debug(`[CACHE] Cache updated and save on file list.m3u ${(fileText.split(/\r\n|\r|\n/).length - 1) / 2} channels and movies. Time elapsed: ${((finishTime - startTime)/1000.0).toFixed(3)}s`)
            saveLastUpdate()
        })
    } catch(error) {
        logger.error(`[CACHE] Error updating cache. Error getting data from URL defined. Error message: ${error.message}`)
    }
}

function saveLastUpdate() {
    file.lastUpdate = Date.now()
    fs.writeFile("lastUpdate.json", JSON.stringify(file), err => {
        if(err) {
            console.error(err)
            return
        }
    })
}

function getLastUpdateFile() {
    return file
}

module.exports = {sendFile, updateCache, getLastUpdateFile}