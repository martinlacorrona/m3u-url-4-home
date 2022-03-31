const fs = require('fs')
const fileName = '../config.json';
const file = require(fileName);

function updateConfig(logger) {
    // LOAD URL
    url = file.URL
    if(url == undefined) {
        logger.error("You should define URL value on config.json file (if it's not exits, create it)")
        exit()
    }
    
    // REGEX PATTERN
    if(file.REGEX_PATTERN != null) {
        regexPattern = new RegExp(file.REGEX_PATTERN)
    } else {
        logger.debug("You don't have defined an regex pattern on config.json file. You can add a new value with REGEX_PATTERN with your pattern.")
    }
}

function getUrl() {
    return file.URL
}

function getRegex() {
    return file.REGEX_PATTERN
}

function getPort() {
    return file.PORT
}

function setConfigValues(url, regex, port) {
    file.URL = url
    file.REGEX_PATTERN = regex
    file.PORT = port
    //TODO: no esta escribiendo el fichero y no se pq :(
    fs.writeFile("config.json", JSON.stringify(file), err => {
        if(err) {
            console.error(err)
            return
        }
        console.log("File updated.")
    })
}

module.exports = {updateConfig, getUrl, getRegex, getPort, setConfigValues}