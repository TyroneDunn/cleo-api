import {Journal} from "./journal.type";
import {JournalEntry} from "../journal-entry/journal-entry.type";
import {User} from "../user/user.type";
import {userOwnsJournal$} from '../utils/userOwnsJournal$';
import {
    createJournal$,
    deleteJournal$,
    journal$,
    journals$,
    searchUsersJournals$,
    searchUsersJournalsAndSortByDateCreated$,
    searchUsersJournalsAndSortByLastUpdated$,
    sortUsersJournalsByDateCreated$,
    sortUsersJournalsByLastUpdated$,
    sortUsersJournalsByName$,
    updateJournal$
} from "./mongo-journals";
import {
    searchJournal$,
    searchJournalAndSortByDateCreated$,
    searchJournalAndSortByLastUpdated$,
} from "../journal-entry/mongo-entries";
import {Request, RequestHandler, Response, Router} from "express";
import {BAD_REQUEST, CREATED, NOT_FOUND, UNAUTHORIZED,} from "../utils/http-status-constants";
import {sendJournal} from "./send-journal";

const sendJournalIfOwnedByUser = (req: Request, res: Response) => {
    return (journal: Journal | undefined) => {
        if (!journal) {
            res.status(NOT_FOUND)
                .json(`Journal ${(req.params.id)} not found.`);
            return;
        }

        userOwnsJournal$(
            (req.user as User)._id.toString(),
            journal._id,
            journal$,
        ).subscribe((ownsJournal) => {
            if (!ownsJournal) {
                res.status(UNAUTHORIZED)
                    .json(`Unauthorized access to journal ${req.params.id}`);
                return;
            }
            res.json(journal);
        });
    };
};

const sendEntriesIfOwnedByUser = (res, req) => {
    return (entries: JournalEntry[]) => {
        if (entries.length === 0) {
            res.status(NOT_FOUND)
                .json('No entries found.');
            return;
        }

        userOwnsJournal$(
            (req.user as User)._id.toString(),
            entries[0].journal._id,
            journal$
        ).subscribe((ownsJournal) => {
            if (!ownsJournal) {
                res.status(UNAUTHORIZED)
                    .json(`Unauthorized access to journal ${req.query.id}`);
                return;
            }
            res.json(entries);
        });
    };
};

const getJournal: RequestHandler = async (req, res) => {
    if (!req.params.id) {
        res.status(BAD_REQUEST)
            .json('Journal id required.');
        return;
    }

    journal$(req.params.id).subscribe(sendJournalIfOwnedByUser(req, res));
};

const searchJournal: RequestHandler = (req, res) => {
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
        ).subscribe(sendEntriesIfOwnedByUser(res, req));
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
        ).subscribe(sendEntriesIfOwnedByUser(res, req));
        return;
    }
};

const searchJournals: RequestHandler = (req: Request, res: Response) => {
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
        searchUsersJournals$(
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
        searchUsersJournalsAndSortByLastUpdated$(
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
        searchUsersJournalsAndSortByDateCreated$(
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

const getJournals: RequestHandler = async (req, res) => {
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
        journals$(
            (req.user as User)._id,
            page,
            limit
        ).subscribe(sendJournals(res));
        return;
    }

    if (sort === 'name') {
        sortUsersJournalsByName$(
            ((req.user as User)._id as string),
            order,
            page,
            limit,
        ).subscribe(sendJournals(res));
        return;
    }

    if (sort === 'lastUpdated') {
        sortUsersJournalsByLastUpdated$(
            ((req.user as User)._id as string),
            order,
            page,
            limit
        ).subscribe(sendJournals(res));
        return;
    }

    if (sort === 'dateCreated') {
        sortUsersJournalsByDateCreated$(
            ((req.user as User)._id as string),
            order,
            page,
            limit
        ).subscribe(sendJournals(res));
        return;
    }
};

const createJournal: RequestHandler = async (req, res) => {
    if (!(req.body.name as string)){
        res.status(BAD_REQUEST)
            .json('Journal name required.');
        return;
    }

    createJournal$((req.user as User)._id.toString(), req.body.name)
        .subscribe((journal: Journal) => {
            res.status(CREATED)
                .json(journal);
        });
};

const deleteJournal: RequestHandler = (req, res) => {
    if (!req.params.id) {
        res.status(BAD_REQUEST)
            .json('Journal id required.');
        return;
    }

    journal$(req.params.id)
        .subscribe((journal) => {
            if (!journal) {
                res.status(NOT_FOUND)
                    .json(`Journal ${(req.params.id)} not found.`);
                return;
            }

            userOwnsJournal$((req.user as User)._id.toString(), req.params.id, journal$)
                .subscribe((ownsJournal: boolean) => {
                    if (!ownsJournal) {
                        res.status(UNAUTHORIZED)
                            .json(`Unauthorized access to journal ${req.params.id}`)
                        return;
                    }

                    deleteJournal$(req.params.id)
                        .subscribe(sendJournal(res));
                })
        });
};

const updateJournal: RequestHandler = async (req, res) => {
    if (!req.params.id) {
        res.status(BAD_REQUEST)
            .json('Journal id required.');
        return;
    }

    journal$(req.params.id)
        .subscribe((journal) => {
            if (!journal) {
                res.status(NOT_FOUND)
                    .json(`Journal ${(req.params.id)} not found.`);
                return;
            }

            userOwnsJournal$((req.user as User)._id.toString(), req.params.id, journal$)
                .subscribe((ownsJournal) => {
                    if (!ownsJournal) {
                        res.status(UNAUTHORIZED)
                            .json(`Unauthorized access to journal ${(req.params.id)}.`);
                        return;
                    }

                    updateJournal$(req.params.id, req.body.name)
                        .subscribe(sendJournal(res));
                });
        });
};

const journalsRouter: Router = Router();
journalsRouter.get('/search/', searchJournals);
journalsRouter.get('/:id', getJournal);
journalsRouter.get('/:id/:search/', searchJournal);
journalsRouter.get('/', getJournals);
journalsRouter.post('/', createJournal);
journalsRouter.delete('/:id', deleteJournal);
journalsRouter.patch('/:id', updateJournal);

export default journalsRouter;