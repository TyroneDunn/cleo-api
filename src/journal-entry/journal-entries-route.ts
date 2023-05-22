import {RequestHandler, Router} from "express";
import {JournalEntryRepository} from "./journal-entry-repository.type";
import {User} from "../user/user.type";
import {JournalRepository} from "../journal/journal-repository.type";
import {
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_CREATED,
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_OK,
    HTTP_STATUS_UNAUTHORIZED
} from "../utils/http-status-constants";
import {map} from "rxjs";
import {JournalEntry} from "./journal-entry.type";
import {userOwnsJournal$} from '../utils/userOwnsJournal$';

export class JournalEntriesRoute {
    public readonly router: Router = Router();
    constructor(
        private journalEntryRepository: JournalEntryRepository,
        private journalRepository: JournalRepository
    ) {
        this.router.get('/:id', this.getEntry)
        this.router.get('/:id', this.getEntries);
        this.router.post('/:id', this.createEntry);
        this.router.delete('/:id', this.deleteEntry);
        this.router.patch('/:id', this.updateEntry);
    }

    private getEntry: RequestHandler = async (req, res) => {
        if (!req.params.id) {
            res.status(HTTP_STATUS_BAD_REQUEST)
                .json('Entry id required.');
            return;
        }

        this.journalEntryRepository.entry$(req.params.id)
            .subscribe((entry: JournalEntry | undefined) => {
                if (!entry) {
                    res.status(HTTP_STATUS_NOT_FOUND)
                        .json(`Journal entry ${req.params.id} not found.`);
                    return;
                }

                userOwnsJournal$(
                    req.user as User,
                    entry.journal,
                    this.journalRepository
                ).subscribe((ownsJournal) => {
                    if (!ownsJournal) {
                        res.status(HTTP_STATUS_UNAUTHORIZED)
                            .json(`Unauthorized access to journal ${entry.journal}`);
                        return;
                    }
                });

                res.status(HTTP_STATUS_OK)
                    .json(entry);
            });
    };

    private getEntries: RequestHandler = async (req, res) => {
        if (!req.params.id) {
            res.status(HTTP_STATUS_BAD_REQUEST)
                .json(`Journal Id required.`);
            return;
        }

        this.journalEntryRepository.entries$(req.params.id)
            .subscribe((entries) => {
                if (!entries) {
                    res.status(HTTP_STATUS_NOT_FOUND)
                        .json(`Journal ${req.params.id} entries not found.`);
                    return;
                }

                userOwnsJournal$(
                    req.user as User,
                    entries[0].journal,
                    this.journalRepository
                ).subscribe((ownsJournal) => {
                    if (!ownsJournal) {
                        res.status(HTTP_STATUS_UNAUTHORIZED)
                            .json(`Unauthorized access to journal ${req.params.id}`);
                        return;
                    }
                });

                res.status(HTTP_STATUS_OK)
                    .json(entries);
            })
    }

    private createEntry: RequestHandler = async (req, res) => {
        if (!req.params.id) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Journal id required.`);
            return;
        }

        if (!req.body.content) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Content required.`);
            return;
        }

        userOwnsJournal$(req.user as User, req.params.id, this.journalRepository)
            .subscribe((ownsJournal) => {
                if (!ownsJournal) {
                    res.status(HTTP_STATUS_UNAUTHORIZED)
                        .json(`Unauthorized access to journal ${req.params.id}`);
                    return;
                }

                this.journalEntryRepository.createEntry$(
                    req.params.id,
                    req.body.content
                ).subscribe((entry) => {
                    res.status(HTTP_STATUS_CREATED).json(entry);
                });
            });
    };

    private deleteEntry: RequestHandler = async (req, res) => {
        if (!req.params.id) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Entry id required.`);
            return;
        }

        this.journalEntryRepository.entry$(req.params.id)
            .subscribe((entry) => {
                if (!entry) {
                    res.status(HTTP_STATUS_NOT_FOUND)
                        .json(`Journal entry ${req.params.id} not found.`);
                    return;
                }
                
                userOwnsJournal$(
                    req.user as User,
                    entry.journal,
                    this.journalRepository
                ).subscribe((ownsJournal) => {
                    if (!ownsJournal) {
                        res.status(HTTP_STATUS_UNAUTHORIZED)
                            .json(`Unauthorized access to journal ${req.params.id}`);
                        return;
                    }

                    this.journalEntryRepository.deleteEntry$(
                        entry.journal,
                        req.params.id
                    ).subscribe((entry) => {
                        res.status(HTTP_STATUS_OK).json(entry);
                    });
                });
            });
    };

    private updateEntry: RequestHandler = async (req, res) => {
        if (!req.params.id) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Entry id required.`);
            return;
        }

        if (!req.body.body) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Entry body required.`);
            return;
        }

        this.journalEntryRepository.entry$(req.params.id)
            .subscribe((entry) => {
                if (!entry) {
                    res.status(HTTP_STATUS_NOT_FOUND)
                        .json(`Journal entry ${req.params.id} not found.`);
                    return;
                }
                
                userOwnsJournal$(
                    req.user as User,
                    entry.journal,
                    this.journalRepository
                ).subscribe((ownsJournal) => {
                    if (!ownsJournal) {
                        res.status(HTTP_STATUS_UNAUTHORIZED)
                            .json(`Unauthorized access to journal ${req.params.id}`);
                        return;
                    }

                    this.journalEntryRepository.updateEntry$(
                        req.params.id,
                        req.body.body
                    ).subscribe((entry) => {
                        res.status(HTTP_STATUS_OK)
                            .json(entry);
                    })
                });
            });
    }
}