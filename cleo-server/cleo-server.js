import express  from 'express';
import { createHandler } from '../request-handler/request-handler-factory.js';
import { JournalsRepository } from '../journals-repository/journals-repository.js';

const app = express();

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

        app.listen(port, () => {
            console.log("Cleo here. I'm listening on port " + port);
        });
    }
};