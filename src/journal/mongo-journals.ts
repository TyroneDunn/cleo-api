import {Journal} from "./journal.type"
import JournalModel from './mongo-journal-model';
import JournalEntryModel
    from "../journal-entry/mongo-journal-entry-model";
import {isValidObjectId} from "../utils/is-valid-object-id";
import {now, ObjectId} from "mongoose";
import {Observable} from "rxjs";

export const journal$ = (id: string): Observable<Journal | undefined> => {
    return new Observable<Journal | undefined>((subscriber) => {
        if (!isValidObjectId(id)) {
            subscriber.next(undefined);
            subscriber.complete();
            return;
        }

        JournalModel.findById(id, (error, journal: Journal) => {
            if (error) {
                subscriber.error(error);
                subscriber.complete();
                return;
            }
            subscriber.next(journal);
            subscriber.complete();
        });
    });
};

export const journals$ = (
    userId: string,
    page: number,
    limit: number
): Observable<Journal[]> => {
    return new Observable<Journal[]>((subscriber) => {
        const skip = (page - 1) * limit;
        JournalModel.find({author: userId})
            .skip(skip)
            .limit(limit)
            .exec((error, journals: Journal[]) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(journals);
                subscriber.complete();
            });
    });
};

export const searchUsersJournals$ = (
    id: string,
    query: string,
    page: number,
    limit: number
): Observable<Journal[]> => {
    return new Observable<Journal[]>((subscriber) => {
        const skip = (page - 1) * limit;
        JournalModel.find({author: id, name: {$regex: query, $options: 'i'}})
            .skip(skip)
            .limit(limit)
            .exec((error, journals: Journal[]) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(journals);
                subscriber.complete();
            });
    });
};

export const searchUsersJournalsAndSortByLastUpdated$ = (
    id: string,
    query: string,
    order: 1 | -1,
    page: number,
    limit: number
): Observable<Journal[]> => {
    return new Observable<Journal[]>((subscriber) => {
        const skip = (page - 1) * limit;
        JournalModel.find({author: id, name: {$regex: query, $options: 'i'}})
            .sort({lastUpdated: order})
            .skip(skip)
            .limit(limit)
            .exec((error, journals: Journal[]) => {
                if (error) {
                   subscriber.error(error);
                   subscriber.complete();
                   return;
                }
                subscriber.next(journals);
                subscriber.complete();
           });
    });
};

export const searchUsersJournalsAndSortByDateCreated$ = (
    id: string,
    query: string,
    order: 1 | -1,
    page: number,
    limit: number
): Observable<Journal[]> => {
    return new Observable<Journal[]>((subscriber) => {
        const skip = (page - 1) * limit;
        JournalModel.find({author: id, name: {$regex: query, $options: 'i'}})
            .sort({dateCreated: order})
            .skip(skip)
            .limit(limit)
            .exec((error, journals: Journal[]) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(journals);
                subscriber.complete();
            });
    });
};

export const sortUsersJournalsByName$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number
): Observable<Journal[]> => {
    return new Observable<Journal[]>((subscriber) => {
        const skip = (page - 1) * limit;
        JournalModel.find({author: id})
            .sort({name: order})
            .skip(skip)
            .limit(limit)
            .exec((error, journals: Journal[]) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(journals);
                subscriber.complete();
            });
    });
};

export const sortUsersJournalsByLastUpdated$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number,
): Observable<Journal[]> => {
    return new Observable<Journal[]>((subscriber) => {
        const skip = (page - 1) * limit;
        JournalModel.find({author: id})
            .sort({dateCreated: order})
            .skip(skip)
            .limit(limit)
            .exec((error, journals: Journal[]) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(journals);
                subscriber.complete();
            });
    });
};

export const sortUsersJournalsByDateCreated$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number
): Observable<Journal[]> => {
    return new Observable<Journal[]>((subscriber) => {
        const skip = (page - 1) * limit;
        JournalModel.find({author: id})
            .sort({dateCreated: order})
            .skip(skip)
            .limit(limit)
            .exec((error, journals: Journal[]) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(journals);
                subscriber.complete();
            });
    });
};

export const createJournal$ = (userId: string, name: string): Observable<Journal> => {
    return new Observable<Journal>((subscriber) => {
        new JournalModel({
            name: name,
            author: userId,
            dateCreated: now(),
            lastUpdated: now(),
        }).save((error, journal: Journal) => {
            if (error) {
                subscriber.error(error);
                subscriber.complete();
                return;
            }
            subscriber.next(journal)
            subscriber.complete();
        });
    });
};

export const deleteJournal$ = (id: string): Observable<Journal> => {
    return new Observable<Journal>((subscriber) => {
        deleteJournalEntries$(id).subscribe();
        JournalModel.findByIdAndDelete(id, (error, journal: Journal) => {
            if (error) {
                subscriber.error(error);
                subscriber.complete();
                return;
            }
            subscriber.next(journal);
            subscriber.complete();
        });
    });
};

const deleteJournalEntries$ = (journalID: string): Observable<void> => {
    return new Observable<void>((subscriber) => {
        JournalEntryModel.deleteMany({journal: journalID}, (error, result) => {
            if (error)
                subscriber.error(error);
            subscriber.complete();
        });
    });
};

export const updateJournal$ = (id: string, name: string): Observable<Journal> => {
        return new Observable<Journal>((subscriber) => {
            JournalModel.findByIdAndUpdate(
                id,
                {name: name, lastUpdated: now()},
                {new: true},
                (error, journal) => {
                    if (error) {
                        subscriber.error(error);
                        subscriber.complete();
                        return;
                    }
                    subscriber.next(journal);
                    subscriber.complete();
                });
        });
};