const cache = require("../utils/cacheUtils.js")

async function cacheRoute(app, logger) {
    app.get('/cache', async function (req, res) {
        res.send(JSON.stringify(cache.getLastUpdateFile()))
    })

    app.post('/cache', async function (req, res) {
        await cache.updateCache(logger)
        res.send(JSON.stringify(cache.getLastUpdateFile()))
    })
}

module.exports = {cacheRoute}