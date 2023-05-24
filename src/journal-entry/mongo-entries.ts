import JournalEntryModel  from "./mongo-journal-entry-model";
import {now} from "mongoose";
import {Observable} from "rxjs";
import {JournalEntry} from "./journal-entry.type";
import {isValidObjectId} from "../utils/isValidObjectId";
import {
    Entry$,
    Entries$,
    SortEntriesBy$,
    DeleteEntry$,
    UpdateEntry$,
} from "./entries$.type";

export const entry$: Entry$ = (id: string) => {
    return new Observable((subscriber) => {
        if (!isValidObjectId(id)) {
            subscriber.next(undefined);
            subscriber.complete();
            return;
        }
        JournalEntryModel.findById(id, (error, entry: JournalEntry) => {
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

export const entries$: Entries$ = (
    id: string,
    page: number,
    limit: number,
) => {
    return new Observable((subscriber) => {
        const skip = (page - 1) * limit;
        if (!isValidObjectId(id)) {
            subscriber.next(undefined);
            subscriber.complete();
            return;
        }

        JournalEntryModel.find({journal: id})
            .skip(skip)
            .limit(limit)
            .exec((error, entries: JournalEntry[]) => {
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

export const sortEntriesByLastUpdated$: SortEntriesBy$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number
) => {
    return new Observable((subscriber) => {
        const skip = (page - 1) * limit;
        JournalEntryModel.find({journal: id})
            .sort({lastUpdated: order})
            .skip(skip)
            .limit(limit)
            .exec((error, entries: JournalEntry[]) => {
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

export const sortEntriesByDateCreated$: SortEntriesBy$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number
) => {
    return new Observable((subscriber) => {
        const skip = (page - 1) * limit;
        JournalEntryModel.find({journal: id})
            .sort({dateCreated: order})
            .skip(skip)
            .limit(limit)
            .exec((error, entries: JournalEntry[]) => {
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
    return new Observable<JournalEntry>((subscriber) => {
        new JournalEntryModel({
            body: body,
            journal: journalId,
            dateCreated: now(),
            lastUpdated: now(),
        }).save((error, entry: JournalEntry) => {
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

export const deleteEntry$: DeleteEntry$ = (id: string) => {
    return new Observable((subscriber) => {
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

export const updateEntry$: UpdateEntry$ = (id: string, body: string) => {
    return new Observable((subscriber) => {
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