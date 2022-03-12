const express = require('express')
const app = express()

require('dotenv').config()

app.get('/', function (req, res) {
    res.redirect(process.env.URL)
})

app.listen(process.env.PORT, function(err) {
    if(err) console.log(`[M3U URL 4 HOME] Error starting server at ${process.env.PORT}`)
    else console.log(`[M3U URL 4 HOME] Server start correctly at ${process.env.PORT}`)
});