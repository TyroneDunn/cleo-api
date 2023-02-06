const express = require('express');
const app = express();

class CleoServer {
    constructor(port) {
        app.get('/', (req, res) => {
            res.send('Good day.');
        });
        
        app.listen(port, () => {
            console.log("Cleo here. I'm listening on port " + port);
        });
    }
};

module.exports.CleoServer = CleoServer;