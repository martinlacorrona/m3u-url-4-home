//IMPORT
const root = require("./routes/root.js")
const config = require("./routes/config.js")
const envUtils = require("./utils/configUtils.js")

//Express
const express = require('express')
const app = express()

//Logger
var log4js = require("log4js");
var logger = log4js.getLogger();
logger.level = "debug"

//Load config
envUtils.updateConfig(logger)

//Rest endpoints
config.configRoute(app, logger)
root.rootRoute(app, logger)

//Start server
app.listen(process.env.PORT || 3000, function(err) {
    if(err) logger.error(`Error starting server at ${process.env.PORT || 3000}\nError: ${err}`)
    else logger.debug(`Server start correctly at ${process.env.PORT || 3000}`)
})