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
} from "../../utils/environment";
import {Journal} from "../journal/journal.type"
import {combineLatest, filter, map, Observable} from "rxjs";
import {JournalEntry} from "./journal-entry.type";
import {userOwnsJournal$} from '../utils/userOwnsJournal$';

export class JournalEntriesRoute {
    public readonly router: Router = Router();
    constructor(
        private journalEntryRepository: JournalEntryRepository,
        private journalRepository: JournalRepository
    ) {
        this.router.get('/:journalid/:entryid', this.getEntry)
        this.router.get('/:id', this.getEntries);
        this.router.post('/:id', this.createEntry);
        this.router.delete('/:journalid/:entryid', this.deleteEntry);
        this.router.patch('/:journalid/:entryid', this.updateEntry);
    }

    private getEntry: RequestHandler = async (req, res) => {
        if (!req.params.journalid) {
            res.status(HTTP_STATUS_BAD_REQUEST)
                .json(`Journal Id required.`);
            return;
        }

        userOwnsJournal$(req.user as User, req.params.journalid)
            .subscribe((ownsJournal) => {
                if (!ownsJournal) {
                    res.status(HTTP_STATUS_UNAUTHORIZED)
                        .json(`Unauthorized access to journal ${req.params.id}`);
                    return;
                }

                this.journalEntryRepository.entry$(req.params.entryid)
                    .subscribe((entry: JournalEntry | undefined) => {
                        if (!entry) {
                            res.status(HTTP_STATUS_NOT_FOUND)
                                .json(`Journal entry ${req.params.entryid} not found.`);
                            return;
                        }

                        res.json(entry);
                    });
            });
    };

    private getEntries: RequestHandler = async (req, res) => {
        combineLatest([
            userOwnsJournal$(req.user as User, req.params.id)
        ]).pipe(map(([ownsJournal]) => {
            if (!ownsJournal) {
                res.status(HTTP_STATUS_UNAUTHORIZED)
                    .json(`Unauthorized access to journal ${(req.params.id)}.`);
                return;
            }

            this.journalEntryRepository.entries$(req.params.id)
                .subscribe((entries) => {
                    res.json(entries);
                })
        })).subscribe();
    }

    private createEntry: RequestHandler = async (req, res) => {
        const journalId = req.params.id;
        if (!journalId) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Journal id required.`);
            return;
        }

        if (!req.body.content) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Content required.`);
            return;
        }

        userOwnsJournal$(req.user as User, journalId).subscribe((ownsJournal) => {
            if (!ownsJournal) {
                res.status(HTTP_STATUS_UNAUTHORIZED).json(`Unauthorized access to journal ${journalId}.`);
                return;
            }

            this.journalEntryRepository.createEntry$(journalId, req.body.content)
                .subscribe((entry) => {
                    res.status(HTTP_STATUS_CREATED).json(entry);
                })
        })
    };

    private deleteEntry: RequestHandler = async (req, res) => {
        const journalId = req.params.journalid;
        if (!journalId) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Journal id required.`);
            return;
        }

        const entryId = req.params.entryid;
        if (!entryId) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Entry id required.`);
            return;
        }

        combineLatest([
            userOwnsJournal$(req.user as User, journalId),
            this.journalEntryRepository.deleteEntry$(journalId, entryId),
        ]).pipe(map(([ownsJournal, entry]) => {
            if (!ownsJournal) {
                res.status(HTTP_STATUS_UNAUTHORIZED)
                    .json(`Unauthorized access to journal ${journalId}.`);
                return;
            }

            res.status(HTTP_STATUS_OK)
                .json(entry);
        })).subscribe();
    };

    private updateEntry: RequestHandler = async (req, res) => {
        if (!req.params.journalid) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Journal id required.`);
            return;
        }

        if (!req.params.entryid) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Entry id required.`);
            return;
        }

        if (!req.body.body) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Entry body required.`);
            return;
        }

        combineLatest([
            userOwnsJournal$(req.user as User, req.params.journalid),
            this.journalEntryRepository.updateEntry$(req.params.entryid, req.body.body),
        ]).pipe(
            filter(([ownsJournal, _]) => {
                return (ownsJournal === true);
            }),
        ).subscribe(([_, entry]) => {
            if (!entry) {
                res.status(HTTP_STATUS_NOT_FOUND)
                    .json(`Journal entry ${(req.params.entryid)} not found.`);
                return;
            }

            res.status(HTTP_STATUS_OK)
                .json(entry);
        });
    }
}