import express  from 'express';
import { createHandler } from '../request-handler/request-handler-factory.js';

const app = express();

export class CleoServer {
    constructor(port) {
        app.get('/', (req, res) => {
            res.send('Good day.');
        });
        
        app.listen(port, () => {
            console.log("Cleo here. I'm listening on port " + port);
        });
    }
};