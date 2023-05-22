import {
    BAD_REQUEST,
    CREATED,
    NOT_FOUND,
    OK,
    UNAUTHORIZED,
} from "../utils/http-status-constants";
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
            res.status(BAD_REQUEST)
                .json(`Id required.`);
            return;
        }

        this.journalRepository.journal$(req.params.id)
            .subscribe((journal: Journal | undefined) => {
                if (!journal) {
                    res.status(NOT_FOUND)
                        .json(`Journal ${(req.params.id)} not found.`);
                    return;
                }
            
                res.json(journal);
            });
    }

    private getJournals: RequestHandler = async (req, res) => {
        const sort: string | undefined = req.query.sort as string;
        if (sort === undefined) {
            this.journalRepository.journals$((req.user as User)._id)
                .subscribe((journals: Journal[]) => {
                    if (journals.length === 0) {
                        res.status(NOT_FOUND)
                            .json(`No journals found.`);
                        return;
                    }
                    res.json(journals);
                });
            return;
        }

        if ((sort !== 'name') &&
            (sort !== 'lastUpdated') &&
            (sort !== 'dateCreated')) {
            res.status(BAD_REQUEST)
                .json(`Invalid sort query.`);
            return;
        }

        let order = req.query.order as string;
        if (!order) order = '1';

        if (sort === 'name') {
            if (parseInt(order) === 1) {
                this.journalRepository.sortUsersJournalsByName$(
                    ((req.user as User)._id as string),
                    1
                ).subscribe((journals) => {
                    if (journals.length === 0) {
                        res.status(NOT_FOUND)
                            .json(`No journals found.`);
                        return;
                    }
                    res.json(journals);
                    return;
                });
        } else {
            this.journalRepository.sortUsersJournalsByName$(
                ((req.user as User)._id as string),
                -1
            ).subscribe((journals) => {
                if (journals.length === 0) {
                    res.status(NOT_FOUND)
                        .json(`No journals found.`);
                    return;
                }
                res.json(journals);
                return;
            });
        }}
        if (sort === 'lastUpdated') {
            if (parseInt(order) === 1) {
                this.journalRepository.sortUsersJournalsByLastUpdated$(
                    ((req.user as User)._id as string),
                    1
                ).subscribe((journals) => {
                    if (journals.length === 0) {
                        res.status(NOT_FOUND)
                            .json(`No journals found.`);
                        return;
                    }
                    res.json(journals);
                    return;
                });
            } else {
                this.journalRepository.sortUsersJournalsByLastUpdated$(
                    ((req.user as User)._id as string),
                    -1
                ).subscribe((journals) => {
                    if (journals.length === 0) {
                        res.status(NOT_FOUND)
                            .json(`No journals found.`);
                        return;
                    }
                    res.json(journals);
                    return;
                });
        }}
    }

    private createJournal: RequestHandler = async (req, res) => {
        if (!(req.body.name as string)){
            res.status(BAD_REQUEST)
                .json('Journal name required.');
            return;
        }

        this.journalRepository.createJournal$((req.user as User)._id, req.body.name)
            .subscribe((journal: Journal) => {
                res.status(CREATED)
                    .json(journal);
            });
    };

    private deleteJournal: RequestHandler = (req, res) => {
        if (!req.params.id) {
            res.status(BAD_REQUEST)
                .json(`Journal id required.`);
            return;
        }

        this.journalRepository.journal$(req.params.id)
            .subscribe((entry) => {
                if (!entry) {
                    res.status(NOT_FOUND)
                        .json(`Journal ${(req.params.id)} not found.`);
                    return;
                }

                userOwnsJournal$((req.user as User), req.params.id, this.journalRepository)
                    .subscribe(ownsJournal => {
                        if (!ownsJournal) {
                            res.status(UNAUTHORIZED)
                                .json(`Unauthorized access to journal ${req.params.id}`)
                            return;
                        }

                        this.journalRepository.deleteJournal$(req.params.id)
                            .subscribe((journal: Journal) => {
                                res.status(OK)
                                    .json(journal);
                            })
                    })
            });
    };

    private updateJournal: RequestHandler = async (req, res) => {
        if (!req.params.id) {
            res.status(BAD_REQUEST)
                .json(`Journal id required.`);
            return;
        }

        this.journalRepository.journal$(req.params.id)
            .subscribe((entry) => {
                if (!entry) {
                    res.status(NOT_FOUND)
                        .json(`Journal ${(req.params.id)} not found.`);
                    return;
                }

                userOwnsJournal$((req.user as User), req.params.id, this.journalRepository)
                    .subscribe((ownsJournal) => {
                        if (!ownsJournal) {
                            res.status(UNAUTHORIZED)
                                .json(`Unauthorized access to journal ${(req.params.id)}.`);
                            return;
                        }

                        this.journalRepository.updateJournal$(req.params.id, req.body.name)
                            .subscribe((journal) => {
                                res.json(journal);
                            });
                    });
            });
    }
}