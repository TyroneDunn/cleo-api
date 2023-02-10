import { JournalRepository } from "../journal-repository/journal-repository";
import bodyParser = require("body-parser");
import express = require("express");

export class CleoAPI {
    private app = express();
    private readonly port: number;
    constructor(port: number, journalsRepository: JournalRepository) {
        this.app.use(bodyParser.json());
        this.port = port;

        this.app.get('/', (req, res) => {
            res.send('Good day.');
        });

        this.app.get('/journals/', async (req, res) => {
            try {
                const id = req.query.id.toString();
                journalsRepository.getJournal(id).then((journal) => {
                    res.json(journal);
                }).catch(() => {
                    res.sendStatus(400);
                });
            }
            catch (e) {
                journalsRepository.getJournals()
                    .then(journals => {
                        res.json(journals);
                    }).catch(() => {
                        res.sendStatus(500);
                });
            }
        });

        this.app.post('/journals/', async (req, res) => {
            const name = req.body.name.toString();
            journalsRepository.createJournal(name).then(() => {
                res.sendStatus(200);
            }).catch(() => {
                res.sendStatus(500);
            });
        });

        this.app.delete('/journals/', (req, res) => {
            const id = req.query.id.toString();
            journalsRepository.deleteJournal(id)
                .then(() => {
                    res.sendStatus(200);
                }).catch(() => {
                    res.sendStatus(400);
            });
        });

        this.app.get('/entry/', (req, res) => {
            try {
                const id = req.query.id.toString();
                journalsRepository.getEntry(id).then((entry) => {
                    res.json(entry);
                }).catch(() => {
                    res.sendStatus(400);
                })
            } catch (e) {
                res.sendStatus(400);
            }
        });

        this.app.post('/entries/', (req, res) => {
            const body = req.body.body.toString();
            const journalID = req.body.journalid.toString();
            journalsRepository.createEntry(journalID, body).then(() => {
                res.sendStatus(200);
            }).catch(() => {
                res.sendStatus(500);
            });
        });
    };

    run() {
        this.app.listen(this.port, () => {
            console.log("Cleo here. I'm listening on port " + this.port);
        });
    };
}
