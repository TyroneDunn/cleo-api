import {User} from "../user/user.type";
import {Journal} from "../journal/journal.type";
import {JournalEntry} from "./journal-entry.type";
import {
    createEntry$,
    deleteEntry$,
    entry$,
    journalEntries$,
    searchUserEntries$,
    searchUserEntriesAndSortByDateCreated$,
    searchUserEntriesAndSortByLastUpdated$,
    sortEntriesByDateCreated$,
    sortEntriesByLastUpdated$,
    updateEntry$,
} from "./mongo-entries";
import {journal$} from "../journal/mongo-journals";
import {Request, RequestHandler, Response} from "express";
import {BAD_REQUEST, CREATED, NOT_FOUND, UNAUTHORIZED} from "../utils/http-status-constants";
import {sendEntries} from "./utils/send-entries";
import {sendEntryIfOwnedByUser} from "./utils/send-entry-if-owned-by-user";
import {sendEntriesIfOwnedByUser} from "./utils/send-entries-if-owned-by-user";
import {userOwnsJournal} from "../utils/user-owns-journal";
import {sendEntry} from "./utils/send-entry";

export const getEntry: RequestHandler = (req: Request, res: Response): void => {
    if (!req.params.id) {
        res.status(BAD_REQUEST)
            .json('Entry id required.');
        return;
    }

    entry$(req.params.id)
        .subscribe(sendEntryIfOwnedByUser(res, req));
};

export const searchEntries: RequestHandler = (req: Request, res: Response): void => {
    const sort: string | undefined = req.query.sort as string;
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 0;

    if (!req.query.q) {
        res.status(BAD_REQUEST)
            .json('Query required.');
        return;
    }

    if ((sort !== 'lastUpdated') &&
        (sort !== 'dateCreated' &&
            (sort !== undefined))) {
        res.status(BAD_REQUEST)
            .json('Invalid sort query.');
        return;
    }

    if (((req.query.order as string) !== '1') &&
        ((req.query.order as string) !== '-1') &&
        ((req.query.order as string) !== undefined)) {
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
        searchUserEntries$(
            ((req.user as User)._id as string),
            req.query.q as string,
            page,
            limit
        ).subscribe(sendEntries(res));
        return;
    }

    if (sort === 'lastUpdated') {
        searchUserEntriesAndSortByLastUpdated$(
            ((req.user as User)._id as string),
            req.query.q as string,
            order,
            page,
            limit
        ).subscribe(sendEntries(res));
        return;
    }

    if (sort === 'dateCreated') {
        searchUserEntriesAndSortByDateCreated$(
            ((req.user as User)._id as string),
            req.query.q as string,
            order,
            page,
            limit
        ).subscribe(sendEntries(res));
        return;
    }
};

export const getJournalEntries: RequestHandler = (req: Request, res: Response): void => {
    const id = req.query.id as string;
    if (!id) {
        res.status(BAD_REQUEST)
            .json('Journal id required.');
        return;
    }

    const sort: string | undefined = req.query.sort as string;
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 0;

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
        journalEntries$(
            id,
            page,
            limit,
        ).subscribe(sendEntriesIfOwnedByUser(req, res));
        return;
    }

    if (sort === 'lastUpdated') {
        sortEntriesByLastUpdated$(
            id,
            order,
            page,
            limit,
        ).subscribe(sendEntriesIfOwnedByUser(req, res));
        return;
    }

    if (sort === 'dateCreated') {
        sortEntriesByDateCreated$(
            id,
            order,
            page,
            limit,
        ).subscribe(sendEntriesIfOwnedByUser(req, res));
        return;
    }
};

export const createEntry: RequestHandler = (req: Request, res: Response): void => {
    if (!req.params.id) {
        res.status(BAD_REQUEST).json('Journal id required.');
        return;
    }

    if (!req.body.body) {
        res.status(BAD_REQUEST).json('Entry body required.');
        return;
    }
    
    journal$(req.params.id).subscribe((journal: Journal | undefined) => {
        if (!userOwnsJournal(((req.user as User)._id.toString()), journal)) {
            res.status(UNAUTHORIZED)
                .json(`Unauthorized access to journal ${req.params.id}`);
            return;
        }
        
        createEntry$(req.params.id, req.body.body)
            .subscribe((entry) => {
                res.status(CREATED)
                    .json(entry);
            });
    });
};

export const deleteEntry: RequestHandler = (req: Request, res: Response): void => {
    if (!req.params.id) {
        res.status(BAD_REQUEST).json('Entry id required.');
        return;
    }

    entry$(req.params.id)
        .subscribe((entry: JournalEntry) => {
            if (!entry) {
                res.status(NOT_FOUND)
                    .json(`Journal entry ${req.params.id} not found.`);
                return;
            }

            journal$(entry.journal).subscribe((journal: Journal | undefined) => {
                if (!userOwnsJournal(((req.user as User)._id.toString()), journal)) {
                    res.status(UNAUTHORIZED)
                        .json(`Unauthorized access to entry ${req.params.id}`);
                    return;
                }
                
                deleteEntry$(req.params.id).subscribe(sendEntry(res));
            });
        });
};

export const updateEntry: RequestHandler = (req: Request, res: Response): void => {
    if (!req.params.id) {
        res.status(BAD_REQUEST).json('Entry id required.');
        return;
    }

    if (!req.body.body) {
        res.status(BAD_REQUEST).json('Entry body required.');
        return;
    }

    entry$(req.params.id)
        .subscribe((entry: JournalEntry) => {
            if (!entry) {
                res.status(NOT_FOUND)
                    .json(`Journal entry ${req.params.id} not found.`);
                return;
            }

            journal$(entry.journal).subscribe((journal: Journal | undefined) => {
                if (!userOwnsJournal(((req.user as User)._id.toString()), journal)) {
                    res.status(UNAUTHORIZED)
                        .json(`Unauthorized access to entry ${req.params.id}`);
                    return;
                }

                updateEntry$(req.params.id, req.body.body)
                    .subscribe(sendEntry(res));
            });
        });
};
