const fs = require('fs').promises
const fileName = '../lastUpdate.json';
const file = require(fileName);
const axios = require('axios').default
const {performance} = require('perf_hooks');
const configUtils = require("./configUtils.js")

var isCacheUpdating = false

async function sendFile(res, logger) {
    var listPath = "./list.m3u";
    try {
        await fs.access(listPath)
        res.download(listPath)
    } catch(e) {
        res
            .status(400)
            .send({
                message: "There's not a m3u download from the url in config, we're trying to download again..."
            })
        updateCache(logger)
    }
}

async function updateCache(logger) {
    if(isCacheUpdating) return
    isCacheUpdating = true
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
            arrayFromServer.forEach((element, index) => {
                if(regexPattern.test(element)) {
                    fileText += element + "\n"
                    fileText += arrayFromServer[index + 1] + "\n"
                }
            })
        }
        await fs.writeFile("./list.m3u", fileText)
        finishTime = performance.now()
        logger.debug(`[CACHE] Cache updated and save on file list.m3u ${(fileText.split(/\r\n|\r|\n/).length - 1) / 2} channels and movies. Time elapsed: ${((finishTime - startTime)/1000.0).toFixed(3)}s`)
        await saveLastUpdate()
    } catch(error) {
        logger.error(`[CACHE] Error updating cache. Error getting data from URL defined. Error message: ${error.message}`)
    }
    isCacheUpdating = false
}

async function saveLastUpdate() {
    file.lastUpdate = Date.now()
    await fs.writeFile("lastUpdate.json", JSON.stringify(file), err => {
        if(err) {
            console.error(err)
        }
    })
}

function getLastUpdateFile() {
    return file
}

module.exports = {sendFile, updateCache, getLastUpdateFile}