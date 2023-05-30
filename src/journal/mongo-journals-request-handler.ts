import {Journal} from "./journal.type";
import {User} from "../user/user.type";
import {Request, RequestHandler, Response} from "express";
import {MongoJournalRepository} from "./mongo-journals-repository";
import {
    searchJournal$,
    searchJournalAndSortByDateCreated$,
    searchJournalAndSortByLastUpdated$,
} from "../entry/mongo-entries";
import {sendJournal} from "./utils/send-journal";
import {sendJournals} from "./utils/send-journals";
import {sendJournalIfOwnedByUser} from "./utils/send-journal-if-owned-by-user";
import {sendEntriesIfOwnedByUser} from "./utils/send-entries-if-owned-by-user";
import {userOwnsJournal} from "../utils/user-owns-journal";
import {BAD_REQUEST, CREATED, NOT_FOUND, UNAUTHORIZED} from "../utils/http-status-constants";

export const getJournal: RequestHandler = (req: Request, res: Response): void => {
    if (!req.params.id) {
        res.status(BAD_REQUEST)
            .json('Journal id required.');
        return;
    }

    MongoJournalRepository.journal$(req.params.id).subscribe(sendJournalIfOwnedByUser(req, res));
};

export const searchJournal: RequestHandler = (req: Request, res: Response): void => {
    if (!req.params.id) {
        res.status(BAD_REQUEST)
            .json('Journal id required.');
        return;
    }

    if (!req.query.q) {
        res.status(BAD_REQUEST)
            .json('Query required.');
        return;
    }

    const sort: string | undefined = req.query.sort as string;
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 0;

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
    if ((req.query.order as string) === '1')
        order = 1;
    else
        order = -1;

    if (sort === undefined) {
        searchJournal$(
            req.params.id,
            req.query.q as string,
            page,
            limit
        ).subscribe(sendEntriesIfOwnedByUser(req, res));
        return;
    }

    if (sort === 'lastUpdated') {
        searchJournalAndSortByLastUpdated$(
            req.params.id,
            req.query.q as string,
            order,
            page,
            limit
        ).subscribe(sendEntriesIfOwnedByUser(req, res));
        return;
    }

    if (sort === 'dateCreated') {
        searchJournalAndSortByDateCreated$(
            req.params.id,
            req.query.q as string,
            order,
            page,
            limit
        ).subscribe(sendEntriesIfOwnedByUser(req, res));
        return;
    }
};

export const searchJournals: RequestHandler = (req: Request, res: Response): void => {
    const sort: string | undefined = req.query.sort as string;
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 0;

    if ((sort !== 'name') &&
        (sort !== 'lastUpdated') &&
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
    if ((req.query.order as string) === '1')
        order = 1;
    else
        order = -1;

    if (sort === undefined) {
        MongoJournalRepository.searchUsersJournals$(
            ((req.user as User)._id.toString()),
            req.query.q as string,
            page,
            limit
        ).subscribe((journals: Journal[]) => {
            if (journals.length === 0) {
                res.status(NOT_FOUND)
                    .json('No journals found.');
                return;
            }

            res.json(journals);
        });
        return;
    }

    if (sort === 'lastUpdated') {
        MongoJournalRepository.searchUsersJournalsAndSortByLastUpdated$(
            ((req.user as User)._id as string),
            req.query.q as string,
            order,
            page,
            limit
        ).subscribe((journals: Journal[]) => {
            if (journals.length === 0) {
                res.status(NOT_FOUND)
                    .json('No journals found.');
                return;
            }

            res.json(journals);
        });
        return;
    }

    if (sort === 'dateCreated') {
        MongoJournalRepository.searchUsersJournalsAndSortByDateCreated$(
            ((req.user as User)._id as string),
            req.query.q as string,
            order,
            page,
            limit
        ).subscribe((journals: Journal[]) => {
            if (journals.length === 0) {
                res.status(NOT_FOUND)
                    .json('No journals found.');
                return;
            }

            res.json(journals);
        });
        return;
    }
};

export const getJournals: RequestHandler = (req: Request, res: Response): void => {
    const sort: string | undefined = req.query.sort as string;
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 0;

    if ((sort !== 'name') &&
        (sort !== 'lastUpdated') &&
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
        MongoJournalRepository.journals$(
            (req.user as User)._id,
            page,
            limit
        ).subscribe(sendJournals(res));
        return;
    }

    if (sort === 'name') {
        MongoJournalRepository.sortUsersJournalsByName$(
            ((req.user as User)._id as string),
            order,
            page,
            limit,
        ).subscribe(sendJournals(res));
        return;
    }

    if (sort === 'lastUpdated') {
        MongoJournalRepository.sortUsersJournalsByLastUpdated$(
            ((req.user as User)._id as string),
            order,
            page,
            limit
        ).subscribe(sendJournals(res));
        return;
    }

    if (sort === 'dateCreated') {
        MongoJournalRepository.sortUsersJournalsByDateCreated$(
            ((req.user as User)._id as string),
            order,
            page,
            limit
        ).subscribe(sendJournals(res));
        return;
    }
};

export const createJournal: RequestHandler = (req: Request, res: Response): void => {
    if (!(req.body.name as string)){
        res.status(BAD_REQUEST)
            .json('Journal name required.');
        return;
    }

    MongoJournalRepository.createJournal$((req.user as User)._id.toString(), req.body.name)
        .subscribe((journal: Journal) => {
            res.status(CREATED)
                .json(journal);
        });
};

export const deleteJournal: RequestHandler = (req: Request, res: Response): void => {
    if (!req.params.id) {
        res.status(BAD_REQUEST)
            .json('Journal id required.');
        return;
    }

    MongoJournalRepository.journal$(req.params.id)
        .subscribe((journal) => {
            if (!journal) {
                res.status(NOT_FOUND)
                    .json(`Journal ${(req.params.id)} not found.`);
                return;
            }

            if (!userOwnsJournal((req.user as User)._id.toString(), journal)) {
                res.status(UNAUTHORIZED)
                    .json(`Unauthorized access to journal ${req.params.id}`)
                return;
            }

            MongoJournalRepository.deleteJournal$(req.params.id)
                .subscribe(sendJournal(res));
        });
};

export const updateJournal: RequestHandler = (req: Request, res: Response): void => {
    if (!req.params.id) {
        res.status(BAD_REQUEST)
            .json('Journal id required.');
        return;
    }

    MongoJournalRepository.journal$(req.params.id)
        .subscribe((journal) => {
            if (!journal) {
                res.status(NOT_FOUND)
                    .json(`Journal ${(req.params.id)} not found.`);
                return;
            }


            if (!userOwnsJournal((req.user as User)._id.toString(), journal)) {
                res.status(UNAUTHORIZED)
                    .json(`Unauthorized access to journal ${(req.params.id)}.`);
                return;
            }

            MongoJournalRepository.updateJournal$(req.params.id, req.body.name)
                .subscribe(sendJournal(res));
        });
};
