const express = require('express')
const app = express()
const port = 5011

app.get('/', (req, res) => {
    res.send('Good day.')
})

app.listen(port, () => {
    console.log("Cleo here. I'm listening on port " + port)
})