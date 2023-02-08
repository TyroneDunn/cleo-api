// import express  from 'express';
const express = require('express');
const bodyParser = require('body-parser');
import { createHandler } from '../request-handler/request-handler-factory.js';
import { JournalsFileRepository } from '../journals-repository/journals-repository.ts';

const app = express();
app.use(bodyParser.json())

export class CleoAPI {
    constructor(port, journalsRepository) {
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

        app.listen(port, () => {
            console.log("Cleo here. I'm listening on port " + port);
        });
    }
};