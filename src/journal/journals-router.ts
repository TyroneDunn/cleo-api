import {Journal} from "./journal.type";
import {JournalEntry} from "../journal-entry/journal-entry.type";
import {User} from "../user/user.type";
import {userOwnsJournal$} from '../utils/userOwnsJournal$';
import {
    journal$,
    journals$,
    searchUsersJournals$,
    searchUsersJournalsAndSortByLastUpdated$,
    searchUsersJournalsAndSortByDateCreated$,
    createJournal$,
    deleteJournal$,
    updateJournal$,
    sortUsersJournalsByName$,
    sortUsersJournalsByDateCreated$,
    sortUsersJournalsByLastUpdated$
} from "./mongo-journals";
import {
    searchJournal$,
    searchJournalAndSortByLastUpdated$,
    searchJournalAndSortByDateCreated$,
} from "../journal-entry/mongo-entries";
import {RequestHandler, Router} from "express";
import {
    BAD_REQUEST,
    CREATED,
    NOT_FOUND,
    UNAUTHORIZED,
} from "../utils/http-status-constants";

const getJournal: RequestHandler = async (req, res) => {
    if (!req.params.id) {
        res.status(BAD_REQUEST)
            .json('Journal id required.');
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
            searchUsersJournals$(
                ((req.user as User)._id as string),
                req.query.q as string,
                page,
                limit
            ).subscribe((journals) => {
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
            searchUsersJournalsAndSortByDateCreated$(
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

    journal$(req.params.id)
    .subscribe((journal: Journal | undefined) => {
        if (!journal) {
            res.status(NOT_FOUND)
                .json(`Journal ${(req.params.id)} not found.`);
            return;
        }

        userOwnsJournal$(
            req.user as User,
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
    });
};

const searchJournal: RequestHandler = (req, res) => {
    if (!req.params.id) {
        res.status(BAD_REQUEST)
            .json('Journal id required.');
        return;
    }

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
        searchJournal$(
            req.params.id,
            req.query.q as string,
            page,
            limit
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
        searchJournalAndSortByLastUpdated$(
            req.params.id,
            req.query.q as string,
            order,
            page,
            limit
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
    
    if (sort === 'dateCreated') {
        searchJournalAndSortByDateCreated$(
            req.params.id,
            req.query.q as string,
            order,
            page,
            limit
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

    if (sort === 'name') {
        sortUsersJournalsByName$(
            ((req.user as User)._id as string),
            order,
            page,
            limit,
        ).subscribe((journals) => {
            if (journals.length === 0) {
                res.status(NOT_FOUND)
                    .json(`No journals found.`);
                return;
            }
            res.json(journals);
        });
        return;
    }

    if (sort === 'lastUpdated') {
        sortUsersJournalsByLastUpdated$(
            ((req.user as User)._id as string),
            order,
            page,
            limit
        ).subscribe((journals) => {
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
        sortUsersJournalsByDateCreated$(
            ((req.user as User)._id as string),
            order,
            page,
            limit
        ).subscribe((journals) => {
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

const createJournal: RequestHandler = async (req, res) => {
    if (!(req.body.name as string)){
        res.status(BAD_REQUEST)
            .json('Journal name required.');
        return;
    }

    createJournal$((req.user as User)._id, req.body.name)
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
        .subscribe((entry) => {
            if (!entry) {
                res.status(NOT_FOUND)
                    .json(`Journal ${(req.params.id)} not found.`);
                return;
            }

            userOwnsJournal$((req.user as User), req.params.id, journal$)
                .subscribe(ownsJournal => {
                    if (!ownsJournal) {
                        res.status(UNAUTHORIZED)
                            .json(`Unauthorized access to journal ${req.params.id}`)
                        return;
                    }

                    deleteJournal$(req.params.id)
                        .subscribe((journal: Journal) => {
                            res.json(journal);
                        })
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
        .subscribe((entry) => {
            if (!entry) {
                res.status(NOT_FOUND)
                    .json(`Journal ${(req.params.id)} not found.`);
                return;
            }

            userOwnsJournal$((req.user as User), req.params.id, journal$)
                .subscribe((ownsJournal) => {
                    if (!ownsJournal) {
                        res.status(UNAUTHORIZED)
                            .json(`Unauthorized access to journal ${(req.params.id)}.`);
                        return;
                    }

                    updateJournal$(req.params.id, req.body.name)
                        .subscribe((journal) => {
                            res.json(journal);
                        });
                });
        });
}

const journalsRouter: Router = Router();
journalsRouter.get('/:id', getJournal);
journalsRouter.get('/:id/search/', searchJournal);
journalsRouter.get('/', getJournals);
journalsRouter.post('/', createJournal);
journalsRouter.delete('/:id', deleteJournal);
journalsRouter.patch('/:id', updateJournal);

export default journalsRouter;