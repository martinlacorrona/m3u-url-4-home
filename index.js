//IMPORT
const rootRoute = require("./routes/root.js")
const configRoute = require("./routes/config.js")
const cacheRoute = require("./routes/cache.js")
const configUtils = require("./utils/configUtils.js")
const cacheUtils = require("./utils/cacheUtils.js")

//Express
const express = require('express')
const app = express()

//Logger
var log4js = require("log4js");
var logger = log4js.getLogger();
logger.level = "debug"

//Load config
configUtils.updateConfig(logger)

//Update cache and timer updater
cacheUtils.updateCache(logger)
setInterval(function() {
    cacheUtils.updateCache(logger)
}, configUtils.getCacheRefresh() || 1800000) //default 30 minutes

//Rest endpoints
configRoute.configRoute(app, logger)
rootRoute.rootRoute(app, logger)
cacheRoute.cacheRoute(app, logger)

//Start server
app.listen(configUtils.getPort() || 3000, function(err) {
    if(err) logger.error(`Error starting server at ${configUtils.getPort() || 3000}\nError: ${err}`)
    else logger.debug(`Server start correctly at ${configUtils.getPort() || 3000}`)
})