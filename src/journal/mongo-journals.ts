import {Journal} from "./journal.type"
import {
    Journal$,
    Journals$,
    SearchUsersJournalsAndSortBy$,
    SortUsersJournals$,
    CreateJournal$,
    DeleteJournal$,
    UpdateJournal$,
} from "./journals$.type";
import {JournalEntry} from "../journal-entry/journal-entry.type";
import JournalModel from './mongo-journal-model';
import JournalEntryModel
    from "../journal-entry/mongo-journal-entry-model";
import {isValidObjectId} from "../utils/isValidObjectId";
import {now, ObjectId} from "mongoose";
import {Observable} from "rxjs";

export const journal$: Journal$ = (id: string) => {
    return new Observable((subscriber) => {
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

export const journals$: Journals$ = (
    userId: string,
    page: number,
    limit: number
) => {
    return new Observable((subscriber) => {
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

export const searchUsersJournalsAndSortByLastUpdated$: SearchUsersJournalsAndSortBy$ = (
    id: string,
    query: string,
    order: 1 | -1,
    page: number,
    limit: number
): Observable<Journal[]> => {
    return new Observable((subscriber) => {
        const skip = (page - 1) * limit;
        JournalModel.find({name: {$regex: query, $options: 'i'}})
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

export const searchUsersJournalsAndSortByDateCreated$: SearchUsersJournalsAndSortBy$ = (
    id: string,
    query: string,
    order: 1 | -1,
    page: number,
    limit: number
): Observable<Journal[]> => {
    return new Observable((subscriber) => {
        const skip = (page - 1) * limit;
        JournalModel.find({name: {$regex: query, $options: 'i'}})
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

export const sortUsersJournalsByName$: SortUsersJournals$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number
): Observable<Journal[]> => {
    return new Observable((subscriber) => {
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

export const sortUsersJournalsByLastUpdated$: SortUsersJournals$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number,
): Observable<Journal[]> => {
    return new Observable((subscriber) => {
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

export const sortUsersJournalsByDateCreated$: SortUsersJournals$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number
): Observable<Journal[]> => {
    return new Observable((subscriber) => {
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
}

export const createJournal$: CreateJournal$ = (
    userId: string,
    name: string
): Observable<Journal> => {
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

export const deleteJournal$: DeleteJournal$ = (id: string): Observable<Journal> => {
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
    return new Observable((subscriber) => {
        JournalEntryModel.deleteMany({journal: journalID}, (error, result) => {
            if (error)
                subscriber.error(error);
            subscriber.complete();
        });
    });
};

export const updateJournal$: UpdateJournal$ =
    (id: string, name: string): Observable<Journal> => {
        return new Observable((subscriber) => {
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