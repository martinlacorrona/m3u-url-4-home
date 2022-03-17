//IMPORT
const root = require("./routes/root.js")

//Express
const express = require('express')
const app = express()

//Logger
var log4js = require("log4js");
const { updateEnv } = require('./routes/root');
var logger = log4js.getLogger();
logger.level = "debug"

//CONFIG .env file
var url = undefined
var regexPattern = undefined

root.rootRoute(app, logger)
root.updateEnv(logger)

app.listen(process.env.PORT || 3000, function(err) {
    if(err) logger.error(`[M3U URL 4 HOME] Error starting server at ${process.env.PORT || 3000}\nError: ${err}`)
    else logger.debug(`[M3U URL 4 HOME] Server start correctly at ${process.env.PORT || 3000}`)
})