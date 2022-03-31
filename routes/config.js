const configUtils = require("../utils/configUtils.js")
const cacheUtils = require("../utils/cacheUtils.js")

function configRoute(app, logger) {
    app.get('/config', async function (req, res) {
        let regexPatternValue = configUtils.getRegex()
        let urlValue = configUtils.getUrl()
        let portValue = configUtils.getPort()
    
        res.json({
            regexPattern: regexPatternValue,
            url: urlValue,
            port: portValue
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
                cacheUtils.updateCache(logger)
            }
            configUtils.setConfigValues(req.query.url, req.query.regexPattern, req.query.port, logger)

            let regexPatternValue = configUtils.getRegex()
            let urlValue = configUtils.getUrl()
            let portValue = configUtils.getPort()

            configUtils.updateConfig(logger)
            
            res
                .status(201)
                .json({
                    regexPattern: regexPatternValue,
                    url: urlValue,
                    port: portValue
                })
        }
    })
}

module.exports = {configRoute}