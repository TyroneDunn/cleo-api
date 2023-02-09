import { JournalRepository } from "../journals-repository/journal-repository";

import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json())

export class CleoAPI {
    port: number;
    constructor(port: number, journalsRepository: JournalRepository) {
        this.port = port;
        
        app.get('/', (req, res) => {
            res.send('Good day.');
        });

        app.get('/journals/', async (req, res) => {
            // res.send('Journals. Stub.');
            const journals = await journalsRepository.getJournals();
            console.log('Is this it?: ' + journals);
            res.json(journals);
            // res.send(journals);
        });

        app.post('/journals/', async (req, res) => {
            const name = req.body.name;
            console.log(name);
            await journalsRepository.createJournal(name);
            res.json(req.body);
        });

        
    };

    run() {
        app.listen(this.port, () => {
            console.log("Cleo here. I'm listening on port " + this.port);
        });
    };
};