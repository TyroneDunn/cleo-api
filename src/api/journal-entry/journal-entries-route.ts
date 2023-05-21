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
import {combineLatest, map, Observable} from "rxjs";
import {JournalEntry} from "./journal-entry.type";

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
        combineLatest([
            this.journalRepository.journalExists$(req.params.journalid),
            this.userOwnsJournal$(req.user as User, req.params.journalid),
        ]).pipe(map(([journalExists, ownsJournal]) => {
            if (!req.params.journalid) {
                res.status(HTTP_STATUS_BAD_REQUEST)
                    .json(`Journal Id required.`);
                return;
            }

            if (!req.params.entryid) {
                res.status(HTTP_STATUS_BAD_REQUEST)
                    .json(`Entry Id required.`);
                return;
            }

            if (!journalExists) {
                res.status(HTTP_STATUS_NOT_FOUND)
                    .json(`Journal ${(req.params.journalid)} not found.`);
                return;
            }

            if (!ownsJournal) {
                res.status(HTTP_STATUS_UNAUTHORIZED)
                    .json(`Unauthorized access to journal ${(req.params.journalid)}.`);
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
                })
        })).subscribe();
    };

    private getEntries: RequestHandler = async (req, res) => {
        combineLatest([
            this.journalRepository.journalExists$(req.params.id),
            this.userOwnsJournal$(req.user as User, req.params.id)
        ]).pipe(map(([journalExists, ownsJournal]) => {
            if (!req.params.id) {
                res.status(HTTP_STATUS_BAD_REQUEST)
                    .json(`Journal Id required.`);
                return;
            }

            if (!journalExists) {
                res.status(HTTP_STATUS_NOT_FOUND)
                    .json(`Journal ${(req.params.id)} not found.`);
                return;
            }

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

        this.userOwnsJournal$(req.user as User, journalId).subscribe((ownsJournal) => {
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

        const hasOwnershipOfJournal = await this.userOwnsJournal$(req.user as User, journalId);
        if (!hasOwnershipOfJournal) {
            res.status(HTTP_STATUS_UNAUTHORIZED).json(`Unauthorized access to journal ${journalId}.`);
            return;
        }

        const entryId = req.params.entryid;
        if (!entryId) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Entry id required.`);
            return;
        }

        this.journalEntryRepository.deleteEntry$(journalId, entryId)
            .subscribe((entry) => {
                res.status(HTTP_STATUS_OK)
                    .json(entry);
            })
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

        this.userOwnsJournal$(req.user as User, req.params.journalid)
            .pipe(map((userOwnsJournal: boolean) => {
                if (!userOwnsJournal) {
                    res.status(HTTP_STATUS_UNAUTHORIZED).json(`Unauthorized access to journal ${(req.params.journalid)}.`);
                    return;
                }

                this.journalEntryRepository.updateEntry$(req.params.entryid, req.body.body)
                    .subscribe((entry: JournalEntry | undefined) => {
                        if (!entry) {
                            res.status(HTTP_STATUS_NOT_FOUND)
                                .json(`Journal entry ${(req.params.entryid)} not found.`);
                            return;
                        }

                        res.status(HTTP_STATUS_OK)
                            .json(entry);
                    })
        })).subscribe();
    }

    private userOwnsJournal$(user: User, journalId: string): Observable<boolean> {
        return this.journalRepository.journal$(journalId).pipe(
            map((journal: Journal | undefined): boolean => {
                if (!journal)
                    return false;

                return(journal.author.toString() === user._id.toString());
            })
        );
    }
}