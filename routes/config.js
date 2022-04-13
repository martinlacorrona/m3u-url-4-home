const configUtils = require("../utils/configUtils.js")
const cacheUtils = require("../utils/cacheUtils.js")

function configRoute(app, logger) {
    app.get('/config', async function (req, res) {
        let regexPatternValue = configUtils.getRegexString()
        let urlValue = configUtils.getUrl()
        let portValue = configUtils.getPort()
        let cacheRefresh = configUtils.getCacheRefresh()
    
        res.json({
            regexPattern: regexPatternValue,
            url: urlValue,
            port: portValue,
            cacheRefresh: cacheRefresh
        })
    })

    app.post('/config', async function (req, res) {
        if(req.query.url == undefined) {
            res
                .status(400)
                .send({
                    message: "You must to send url param."
                })
        } else {
            if(req.query.url != configUtils.getUrl()) { //update cache if url changes
                await cacheUtils.updateCache(logger)
            }
            configUtils.setConfigValues(req.query.url, req.query.regexPattern, req.query.port, req.query.cacheRefresh, logger)

            let regexPatternValue = configUtils.getRegexString()
            let urlValue = configUtils.getUrl()
            let portValue = configUtils.getPort()
            let cacheRefresh = configUtils.getCacheRefresh()

            configUtils.updateConfig(logger)
            
            res
                .status(201)
                .json({
                    regexPattern: regexPatternValue,
                    url: urlValue,
                    port: portValue,
                    cacheRefresh: cacheRefresh
                })
        }
    })
}

module.exports = {configRoute}