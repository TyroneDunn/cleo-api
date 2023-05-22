import {
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_CREATED,
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_OK,
    HTTP_STATUS_UNAUTHORIZED,
} from "../../utils/environment";
import {RequestHandler, Router} from "express";
import {JournalRepository} from "./journal-repository.type";
import {User} from "../user/user.type";
import {Journal} from "./journal.type";
import {userOwnsJournal$} from '../utils/userOwnsJournal$';

export class JournalRoute {
    public readonly router: Router = Router();
    constructor(private journalRepository: JournalRepository) {
        this.router.get('/:id', this.getJournal);
        this.router.get('/', this.getJournals);
        this.router.post('/', this.createJournal);
        this.router.delete('/:id', this.deleteJournal);
        this.router.patch('/:id', this.updateJournal);
    }

    private getJournal: RequestHandler = async (req, res) => {
        if (!req.params.id) {
            res.status(HTTP_STATUS_BAD_REQUEST)
                .json(`ID required.`);
            return;
        }

        this.journalRepository.journal$(req.params.id)
            .subscribe((journal: Journal | undefined) => {
                if (!journal) {
                    res.status(HTTP_STATUS_NOT_FOUND)
                        .json(`Journal ${(req.params.id)} not found.`);
                    return;
                }
            
                res.json(journal);
            });
    }

    private getJournals: RequestHandler = async (req, res) => {
        this.journalRepository.journals$((req.user as User)._id)
            .subscribe((journals: Journal[]) => {
                res.json(journals);
            });
    };

    private createJournal: RequestHandler = async (req, res) => {
        if (!(req.body.name as string)){
            res.status(HTTP_STATUS_BAD_REQUEST)
                .json('Journal name required.');
            return;
        }

        this.journalRepository.createJournal$((req.user as User)._id, req.body.name)
            .subscribe((journal: Journal) => {
                res.status(HTTP_STATUS_CREATED)
                    .json(journal);
            });
    };

    private deleteJournal: RequestHandler = (req, res) => {
        if (!req.params.id) {
            res.status(HTTP_STATUS_BAD_REQUEST)
                .json(`Journal id required.`);
            return;
        }
        
        userOwnsJournal$((req.user as User), req.params.id, this.journalRepository)
            .subscribe(ownsJournal => {
                if (!ownsJournal) {
                    res.status(HTTP_STATUS_UNAUTHORIZED)
                        .json(`Unauthorized access to journal ${req.params.id}`)
                    return;
                }

                this.journalRepository.deleteJournal$(req.params.id)
                    .subscribe((journal: Journal) => {
                        res.status(HTTP_STATUS_OK)
                            .json(journal);
                    })
            })
    };

    private updateJournal: RequestHandler = async (req, res) => {
        if (!req.params.id) {
            res.status(HTTP_STATUS_BAD_REQUEST)
                .json(`Journal id required.`);
            return;
        }

        userOwnsJournal$((req.user as User), req.params.id, this.journalRepository)
            .subscribe((ownsJournal) => {
                if (!ownsJournal) {
                    res.status(HTTP_STATUS_UNAUTHORIZED)
                        .json(`Unauthorized access to journal ${(req.params.id)}.`);
                    return;
                }

                this.journalRepository.updateJournal$(req.params.id, req.body.name)
                    .subscribe((journal) => {
                        res.status(HTTP_STATUS_OK)
                            .json(journal);
                    });
            });
    }
}