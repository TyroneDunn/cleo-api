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
import {combineLatest, map, Observable } from "rxjs";

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
        const journalId = req.params.journalid;
        if (!journalId) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Journal Id required.`);
            return;
        }

        const entryId = req.params.entryid;
        if (!entryId) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Entry Id required.`);
            return;
        }

        const journalExists = await this.journalRepository.journalExists(journalId);
        if (!journalExists) {
            res.status(HTTP_STATUS_NOT_FOUND).json(`Journal ${journalId} not found.`);
            return;
        }

        const hasOwnershipOfJournal = await this.userOwnsJournal$(req.user as User, journalId);
        if (!hasOwnershipOfJournal) {
            res.status(HTTP_STATUS_UNAUTHORIZED).json(`Unauthorized access to journal ${journalId}.`);
            return;
        }

        const journalEntryExists = await this.journalEntryRepository.journalEntryExists(entryId);
        if (!journalEntryExists) {
            res.status(HTTP_STATUS_NOT_FOUND).json(`Journal entry ${entryId} not found.`);
            return;
        }

        const entry = await this.journalEntryRepository.getEntry(entryId);
        res.json(entry);
    };

    private getEntries: RequestHandler = async (req, res) => {
        const journalId = req.params.id;
        if (!journalId) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Journal id required.`)
            return;
        }

        const journalExists = this.journalRepository.journalExists(journalId);
        if (!journalExists) {
            res.status(HTTP_STATUS_NOT_FOUND).json(`Journal ${journalId} not found.`);
            return;
        }

        const hasOwnershipOfJournal = await this.assertJournalOwnership(req.user as User, journalId);
        if (!hasOwnershipOfJournal) {
            res.status(HTTP_STATUS_UNAUTHORIZED).json(`Unauthorized access to journal ${journalId}.`);
            return;
        }

        const entries = await this.journalEntryRepository.getEntries(journalId);
        res.json(entries);
    }

    private createEntry: RequestHandler = async (req, res) => {
        const journalId = req.params.id;
        if (!journalId) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Journal id required.`);
            return;
        }

        const hasOwnershipOfJournal = await this.userOwnsJournal$(req.user as User, journalId);
        if (!hasOwnershipOfJournal) {
            res.status(HTTP_STATUS_UNAUTHORIZED).json(`Unauthorized access to journal ${journalId}.`);
            return;
        }

        const entryContent = req.body.content;
        if (!entryContent) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Content required.`);
            return;
        }

        const journal = await this.journalEntryRepository.createEntry(journalId, entryContent);
        res.status(HTTP_STATUS_CREATED).json(journal);
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

        const entryExists = await this.journalEntryRepository.journalEntryExists(entryId);
        if (!entryExists) {
            res.status(HTTP_STATUS_NOT_FOUND).json(`Journal entry ${entryId} not found.`);
            return;
        }

        await this.journalEntryRepository.deleteEntry(journalId, entryId);
        res.status(HTTP_STATUS_OK).json(`Journal entry ${entryId} deleted.`);
    };

    private updateEntry: RequestHandler = async (req, res) => {
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

        const entryExists = await this.journalEntryRepository.journalEntryExists(entryId);
        if (!entryExists) {
            res.status(HTTP_STATUS_NOT_FOUND).json(`Journal entry ${entryId} not found.`);
            return;
        }

        const entryBody = req.body.body;
        if (!entryBody) {
            res.status(HTTP_STATUS_BAD_REQUEST).json(`Entry body required.`);
            return;
        }

        const journalEntry = await this.journalEntryRepository.updateEntry(entryId, entryBody);
        res.status(HTTP_STATUS_OK).json(journalEntry);
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