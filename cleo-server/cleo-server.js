import express  from 'express';
import bodyParser from 'body-parser';
import { createHandler } from '../request-handler/request-handler-factory.js';
import { JournalsRepository } from '../journals-repository/journals-repository.js';

const app = express();
app.use(bodyParser.json())

export class CleoServer {
    constructor(port, journalsRepository) {
        app.get('/', (req, res) => {
            res.send('Good day.');
        });

        app.get('/journals/', (req, res) => {
            // res.send('Journals. Stub.');
            res.json({
                dir: 'Journals.',
                journals: journalsRepository.getJournals(),
            });
        });

        app.post('/journals/', (req, res) => {
            const name = req.body.name;
            console.log(name);
            journalsRepository.createJournal(name);
            res.json(req.body);
        });

        app.listen(port, () => {
            console.log("Cleo here. I'm listening on port " + port);
        });
    }
};