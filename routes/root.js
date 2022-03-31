const cache = require("../utils/cacheUtils.js")

function rootRoute(app, logger) {
    app.get('/', async function (req, res) {
        cache.sendFile(res)
    })
}

module.exports = {rootRoute}