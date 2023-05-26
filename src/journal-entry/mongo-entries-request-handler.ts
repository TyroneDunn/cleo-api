import {JournalEntry} from "./journal-entry.type";
import {User} from "../user/user.type";
import {
    entry$,
    entries$,
    searchEntries$,
    searchEntriesAndSortByDateCreated$,
    searchEntriesAndSortByLastUpdated$,
    sortEntriesByLastUpdated$,
    sortEntriesByDateCreated$,
    createEntry$,
    deleteEntry$,
    updateEntry$,
} from "./mongo-entries";
import {userOwnsJournal} from '../utils/user-owns-journal';
import {journal$} from "../journal/mongo-journals";
import {RequestHandler, Router} from "express";
import {
    BAD_REQUEST,
    CREATED,
    NOT_FOUND,
    UNAUTHORIZED
} from "../utils/http-status-constants";

const getEntry: RequestHandler = async (req, res) => {
    if (!req.params.id) {
        res.status(BAD_REQUEST)
            .json('Entry id required.');
        return;
    }

    if (req.params.id === 'search') {
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
            searchEntries$(
                ((req.user as User)._id as string),
                req.query.q as string,
                page,
                limit
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

        if (sort === 'lastUpdated') {
            searchEntriesAndSortByLastUpdated$(
                ((req.user as User)._id as string),
                req.query.q as string,
                order,
                page,
                limit
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
            searchEntriesAndSortByDateCreated$(
                ((req.user as User)._id as string),
                req.query.q as string,
                order,
                page,
                limit
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

    entry$(req.params.id)
        .subscribe((entry: JournalEntry | undefined) => {
            if (!entry) {
                res.status(NOT_FOUND)
                    .json(`Journal entry ${req.params.id} not found.`);
                return;
            }

            userOwnsJournal$(
                req.user as User,
                entry.journal,
                journal$
            ).subscribe((ownsJournal) => {
                if (!ownsJournal) {
                    res.status(UNAUTHORIZED)
                        .json(`Unauthorized access to entry ${req.params.id}`);
                    return;
                }
                res.json(entry);
            });
        });
};

const getEntries: RequestHandler = async (req, res) => {
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
        entries$(
            id,
            page,
            limit,
        ).subscribe((entries: JournalEntry[]) => {
            if (entries.length === 0) {
                res.status(NOT_FOUND)
                    .json('No entries found.')
                return;
            }

            userOwnsJournal$(
                req.user as User,
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
        });
        return;
    }

    if (sort === 'lastUpdated') {
        sortEntriesByLastUpdated$(
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

            userOwnsJournal$(
                req.user as User,
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
        });
        return;
    }

    if (sort === 'dateCreated') {
        sortEntriesByDateCreated$(
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

            userOwnsJournal$(
                req.user as User,
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
        });
        return;
    }
}

const createEntry: RequestHandler = async (req, res) => {
    if (!req.params.id) {
        res.status(BAD_REQUEST).json('Journal id required.');
        return;
    }

    if (!req.body.body) {
        res.status(BAD_REQUEST).json('Entry body required.');
        return;
    }

    userOwnsJournal$(req.user as User, req.params.id, journal$)
        .subscribe((ownsJournal) => {
            if (!ownsJournal) {
                res.status(UNAUTHORIZED)
                    .json(`Unauthorized access to journal ${req.params.id}`);
                return;
            }

            createEntry$(
                req.params.id,
                req.body.body,
            ).subscribe((entry) => {
                res.status(CREATED)
                    .json(entry);
            });
        });
};

const deleteEntry: RequestHandler = async (req, res) => {
    if (!req.params.id) {
        res.status(BAD_REQUEST).json('Entry id required.');
        return;
    }

    entry$(req.params.id)
        .subscribe((entry) => {
            if (!entry) {
                res.status(NOT_FOUND)
                    .json(`Journal entry ${req.params.id} not found.`);
                return;
            }

            userOwnsJournal$(
                req.user as User,
                entry.journal,
                journal$
            ).subscribe((ownsJournal) => {
                if (!ownsJournal) {
                    res.status(UNAUTHORIZED)
                        .json(`Unauthorized access to journal ${req.params.id}`);
                    return;
                }

                deleteEntry$(
                    req.params.id
                ).subscribe((entry) => {
                    res.json(entry);
                });
            });
        });
};

const updateEntry: RequestHandler = async (req, res) => {
    if (!req.params.id) {
        res.status(BAD_REQUEST).json('Entry id required.');
        return;
    }

    if (!req.body.body) {
        res.status(BAD_REQUEST).json('Entry body required.');
        return;
    }

    entry$(req.params.id)
        .subscribe((entry) => {
            if (!entry) {
                res.status(NOT_FOUND)
                    .json(`Journal entry ${req.params.id} not found.`);
                return;
            }

            userOwnsJournal$(
                req.user as User,
                entry.journal,
                journal$
            ).subscribe((ownsJournal) => {
                if (!ownsJournal) {
                    res.status(UNAUTHORIZED)
                        .json(`Unauthorized access to entry ${req.params.id}`);
                    return;
                }

                updateEntry$(
                    req.params.id,
                    req.body.body
                ).subscribe((entry) => {
                    res.json(entry);
                });
            });
        });
}

const journalEntriesRouter: Router = Router();
journalEntriesRouter.get('/:id', getEntry);
journalEntriesRouter.get('', getEntries);
journalEntriesRouter.post('/:id', createEntry);
journalEntriesRouter.delete('/:id', deleteEntry);
journalEntriesRouter.patch('/:id', updateEntry);
export default journalEntriesRouter;