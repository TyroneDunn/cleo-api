import {Entry} from "./entry.type";
import JournalEntryModel  from "./mongo-journal-entry-model";
import {isValidObjectId} from "../utils/is-valid-object-id";
import {Observable} from "rxjs";
import {now} from "mongoose";

export const entry$ = (id: string): Observable<Entry> => {
    return new Observable<Entry | undefined>((subscriber) => {
        if (!isValidObjectId(id)) {
            subscriber.next(undefined);
            subscriber.complete();
            return;
        }

        JournalEntryModel.findById(id, (error, entry: Entry) => {
            if (error) {
                subscriber.error(error);
                subscriber.complete();
                return;
            }

            subscriber.next(entry);
            subscriber.complete();
        });
    });
};

export const searchJournal$ = (
    id: string,
    query: string,
    page: number,
    limit: number
): Observable<Entry[]> => {
    return new Observable<Entry[]>((subscriber) => {
        const skip = (page - 1) * limit;
        JournalEntryModel.find({journal: id, body: {$regex: query, $options: 'i'}})
            .skip(skip)
            .limit(limit)
            .exec((error, entries: Entry[]) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(entries);
                subscriber.complete();
            });
    });
};

export const searchJournalAndSortByLastUpdated$ = (
    id: string,
    query: string,
    order: 1 | -1,
    page: number,
    limit: number
): Observable<Entry[]> => {
    return new Observable<Entry[]>((subscriber) => {
        const skip = (page - 1) * limit;
        JournalEntryModel.find({journal: id, body: {$regex: query, $options: 'i'}})
            .sort({lastUpdated: order})
            .skip(skip)
            .limit(limit)
            .exec((error, entries: Entry[]) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(entries);
                subscriber.complete();
            });
    });
};

export const searchJournalAndSortByDateCreated$ = (
    id: string,
    query: string,
    order: 1 | -1,
    page: number,
    limit: number
): Observable<Entry[]> => {
    return new Observable<Entry[]>((subscriber) => {
        const skip = (page - 1) * limit;
        JournalEntryModel.find({journal: id, body: {$regex: query, $options: 'i'}})
            .sort({dateCreated: order})
            .skip(skip)
            .limit(limit)
            .exec((error, entries: Entry[]) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(entries);
                subscriber.complete();
            });
    });
};

export const journalEntries$ = (
    id: string,
    page: number,
    limit: number,
): Observable<Entry[]> => {
    return new Observable<Entry[]>((subscriber) => {
        const skip = (page - 1) * limit;
        if (!isValidObjectId(id)) {
            subscriber.next(undefined);
            subscriber.complete();
            return;
        }

        JournalEntryModel.find({journal: id})
            .skip(skip)
            .limit(limit)
            .exec((error, entries: Entry[]) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(entries);
                subscriber.complete();
            });
    });
};

export const searchUserEntries$= (
    id: string,
    query: string,
    page: number,
    limit: number
): Observable<Entry[]> => {
    return new Observable<Entry[]>((subscriber) => {
        const skip = (page - 1) * limit;
        JournalEntryModel.find({body: {$regex: query, $options: 'i'}})
            .skip(skip)
            .limit(limit)
            .exec((error, entries: Entry[]) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(entries);
                subscriber.complete();
            });
    });
};

export const searchUserEntriesAndSortByLastUpdated$ = (
    id: string,
    query: string,
    order: 1 | -1,
    page: number,
    limit: number
): Observable<Entry[]> => {
    return new Observable<Entry[]>((subscriber) => {
        const skip = (page - 1) * limit;
        JournalEntryModel.find({body: {$regex: query, $options: 'i'}})
            .sort({lastUpdated: order})
            .skip(skip)
            .limit(limit)
            .exec((error, entries: Entry[]) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(entries);
                subscriber.complete();
            });
    });
};

export const searchUserEntriesAndSortByDateCreated$ = (
    id: string,
    query: string,
    order: 1 | -1,
    page: number,
    limit: number
): Observable<Entry[]> => {
    return new Observable<Entry[]>((subscriber) => {
        const skip = (page - 1) * limit;
        JournalEntryModel.find({body: {$regex: query, $options: 'i'}})
            .sort({dateCreated: order})
            .skip(skip)
            .limit(limit)
            .exec((error, entries: Entry[]) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(entries);
                subscriber.complete();
            });
    });
};

export const sortEntriesByLastUpdated$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number
): Observable<Entry[]> => {
    return new Observable<Entry[]>((subscriber) => {
        const skip = (page - 1) * limit;
        JournalEntryModel.find({journal: id})
            .sort({lastUpdated: order})
            .skip(skip)
            .limit(limit)
            .exec((error, entries: Entry[]) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(entries);
                subscriber.complete();
            });
    });
};

export const sortEntriesByDateCreated$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number
): Observable<Entry[]> => {
    return new Observable<Entry[]>((subscriber) => {
        const skip = (page - 1) * limit;
        JournalEntryModel.find({journal: id})
            .sort({dateCreated: order})
            .skip(skip)
            .limit(limit)
            .exec((error, entries: Entry[]) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(entries);
                subscriber.complete();
            });
    });
};

export const createEntry$ = (journalId: string, body: string) => {
    return new Observable<Entry>((subscriber) => {
        new JournalEntryModel({
            body: body,
            journal: journalId,
            dateCreated: now(),
            lastUpdated: now(),
        }).save((error, entry: Entry) => {
            if (error) {
                subscriber.error(error);
                subscriber.complete();
                return;
            }
            subscriber.next(entry);
            subscriber.complete();
        });
    });
};

export const deleteEntry$ = (id: string): Observable<Entry> => {
    return new Observable<Entry>((subscriber) => {
        JournalEntryModel.findByIdAndDelete(id, (error, entry) => {
            if (error) {
                subscriber.error(error)
                subscriber.complete();
                return;
            }
            subscriber.next(entry);
            subscriber.complete();
        })
    });
};

export const updateEntry$ = (id: string, body: string): Observable<Entry> => {
    return new Observable<Entry>((subscriber) => {
        JournalEntryModel.findByIdAndUpdate(
            id,
            {
                body: body,
                lastUpdated: now(),
            },
            {new: true},
            (error, entry) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(entry);
                subscriber.complete();
            })
    });
};