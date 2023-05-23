import {RequestHandler, Router} from "express";
import {JournalEntryRepository} from "./journal-entry-repository.type";
import {User} from "../user/user.type";
import {JournalRepository} from "../journal/journal-repository.type";
import {
    BAD_REQUEST,
    CREATED,
    NOT_FOUND,
    UNAUTHORIZED
} from "../utils/http-status-constants";
import {JournalEntry} from "./journal-entry.type";
import {userOwnsJournal$} from '../utils/userOwnsJournal$';

export class JournalEntriesRoute {
    public readonly router: Router = Router();
    constructor(
        private journalEntryRepository: JournalEntryRepository,
        private journalRepository: JournalRepository
    ) {
        this.router.get('/:id', this.getEntry);
        this.router.get('', this.getEntries);
        this.router.post('/:id', this.createEntry);
        this.router.delete('/:id', this.deleteEntry);
        this.router.patch('/:id', this.updateEntry);
    }

    private getEntry: RequestHandler = async (req, res) => {
        if (!req.params.id) {
            res.status(BAD_REQUEST)
                .json('Entry id required.');
            return;
        }

        this.journalEntryRepository.entry$(req.params.id)
            .subscribe((entry: JournalEntry | undefined) => {
                if (!entry) {
                    res.status(NOT_FOUND)
                        .json(`Journal entry ${req.params.id} not found.`);
                    return;
                }

                userOwnsJournal$(
                    req.user as User,
                    entry.journal,
                    this.journalRepository
                ).subscribe((ownsJournal) => {
                    if (!ownsJournal) {
                        res.status(UNAUTHORIZED)
                            .json(`Unauthorized access to journal ${entry.journal}`);
                        return;
                    }
                });

                res.json(entry);
            });
    };

    private getEntries: RequestHandler = async (req, res) => {
        const id = req.query.id as string;
        if (!id) {
            res.status(BAD_REQUEST)
                .json('Entry id required.');
            return;
        }
        
        const sort: string | undefined = req.query.sort as string;
        const page: number = parseInt(req.query.page as string) || 1;
        const limit: number = parseInt(req.query.limit as string) || 0;

        this.journalEntryRepository.entries$(
            id,
            page,
            limit,
            ).subscribe((entries) => {
                if (entries.length === 0) {
                    res.status(NOT_FOUND)
                        .json(`Journal ${id} entries not found.`);
                    return;
                }

                userOwnsJournal$(
                    req.user as User,
                    entries[0].journal,
                    this.journalRepository
                ).subscribe((ownsJournal) => {
                    if (!ownsJournal) {
                        res.status(UNAUTHORIZED)
                            .json(`Unauthorized access to journal ${id}`);
                        return;
                    }
                });
                res.json(entries);
                return;
            })
        
        
        if ((sort !== undefined) &&
            (sort !== 'lastUpdated') &&
            (sort !== 'dateCreated')) {
            res.status(BAD_REQUEST)
                .json('Invalid sort query.');
            return;
        }

        if ((((req.query.order as string) !== undefined) && 
            (req.query.order as string) !== '1') &&
            ((req.query.order as string) !== '-1')) {
            res.status(BAD_REQUEST)
                .json('Invalid order query.');
            return;
        }

        if (page < 0) {
            res.status(BAD_REQUEST)
                .json('Invalid page query.');
            return;
        }

        if (limit < 0) {
            res.status(BAD_REQUEST)
                .json('Invalid limit query.');
            return;
        }

        let order: 1 | -1;
        if ((req.query.order as string) === '-1')
            order = -1;
        else
            order = 1;


        if (sort === undefined) {
            this.journalEntryRepository.entries$(
                id,
                page,
                limit,
            ).subscribe((entries: JournalEntry[]) => {
                if (entries.length === 0) {
                    res.status(NOT_FOUND)
                        .json('No entries found.')
                    return;
                }
                res.json(entries);
            });
            return;
        }

        if (sort === 'lastUpdated') {
            this.journalEntryRepository.sortEntriesByLastUpdated$(
                id,
                order,
                page,
                limit,
            ).subscribe((entries) => {
                if (entries.length === 0) {
                    res.status(NOT_FOUND)
                        .json('No entries found.');
                    return;
                }
                res.json(entries);
            });
            return;
        }
        
        if (sort === 'dateCreated') {
            this.journalEntryRepository.sortEntriesByDateCreated$(
                id,
                order,
                page,
                limit,
            ).subscribe((entries) => {
                if (entries.length === 0) {
                    res.status(NOT_FOUND)
                        .json('No entries found.');
                    return;
                }
                res.json(entries);
            });
            return;
        }
    }

    private createEntry: RequestHandler = async (req, res) => {
        if (!req.params.id) {
            res.status(BAD_REQUEST).json(`Journal id required.`);
            return;
        }

        if (!req.body.content) {
            res.status(BAD_REQUEST).json(`Content required.`);
            return;
        }

        userOwnsJournal$(req.user as User, req.params.id, this.journalRepository)
            .subscribe((ownsJournal) => {
                if (!ownsJournal) {
                    res.status(UNAUTHORIZED)
                        .json(`Unauthorized access to journal ${req.params.id}`);
                    return;
                }

                this.journalEntryRepository.createEntry$(
                    req.params.id,
                    req.body.content
                ).subscribe((entry) => {
                    res.status(CREATED).json(entry);
                });
            });
    };

    private deleteEntry: RequestHandler = async (req, res) => {
        if (!req.params.id) {
            res.status(BAD_REQUEST).json(`Entry id required.`);
            return;
        }

        this.journalEntryRepository.entry$(req.params.id)
            .subscribe((entry) => {
                if (!entry) {
                    res.status(NOT_FOUND)
                        .json(`Journal entry ${req.params.id} not found.`);
                    return;
                }
                
                userOwnsJournal$(
                    req.user as User,
                    entry.journal,
                    this.journalRepository
                ).subscribe((ownsJournal) => {
                    if (!ownsJournal) {
                        res.status(UNAUTHORIZED)
                            .json(`Unauthorized access to journal ${req.params.id}`);
                        return;
                    }

                    this.journalEntryRepository.deleteEntry$(
                        req.params.id
                    ).subscribe((entry) => {
                        res.json(entry);
                    });
                });
            });
    };

    private updateEntry: RequestHandler = async (req, res) => {
        if (!req.params.id) {
            res.status(BAD_REQUEST).json(`Entry id required.`);
            return;
        }

        if (!req.body.body) {
            res.status(BAD_REQUEST).json(`Entry body required.`);
            return;
        }

        this.journalEntryRepository.entry$(req.params.id)
            .subscribe((entry) => {
                if (!entry) {
                    res.status(NOT_FOUND)
                        .json(`Journal entry ${req.params.id} not found.`);
                    return;
                }
                
                userOwnsJournal$(
                    req.user as User,
                    entry.journal,
                    this.journalRepository
                ).subscribe((ownsJournal) => {
                    if (!ownsJournal) {
                        res.status(UNAUTHORIZED)
                            .json(`Unauthorized access to journal ${req.params.id}`);
                        return;
                    }

                    this.journalEntryRepository.updateEntry$(
                        req.params.id,
                        req.body.body
                    ).subscribe((entry) => {
                        res.json(entry);
                    });
                });
            });
    }
}