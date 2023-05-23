import {JournalRepository} from "./journal-repository.type";
import JournalModel from './journal-model'
import JournalEntryModel, {JournalEntryDocument}
    from "../journal-entry/journal-entry-model";
import {now, ObjectId} from "mongoose";
import {Observable} from "rxjs";
import {Journal} from "./journal.type";
import {JournalEntry} from "../journal-entry/journal-entry.type";
import {isValidObjectId} from "../utils/isValidObjectId";

export class MongooseJournalRepository implements JournalRepository {
    public journal$(id: string): Observable<Journal | undefined> {
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
    }

    public journals$(
        userId: string,
        page: number,
        limit: number
    ): Observable<Journal[]> {
        return new Observable((subscriber) => {
            const skip = (page - 1) * limit;
            JournalModel.find()
            JournalModel.find(
                {author: userId},
                null,
                {skip: skip, limit: limit},
                (error, journals: Journal[]) => {
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

    public sortUsersJournalsByName$(
        id: string,
        order: 1 | -1,
        page: number,
        limit: number
        ): Observable<Journal[]> {
            return new Observable((subscriber) => {
                const skip = (page - 1) * limit;
                JournalModel.find({author: id})
                    .sort({name: order})
                    .skip(skip)
                    .limit(limit)
                    .exec((error, journals: Journal[]) => {
                        subscriber.next(journals);
                        subscriber.complete();
                    });
            });
    }

    public sortUsersJournalsByDateCreated$(id: string, order: 1 | -1): Observable<Journal[]> {
        return new Observable((subscriber) => {
            JournalModel.find({author: id}).sort({dateCreated: order})
                .then((journal: Journal[]) => {
                    subscriber.next(journal);
                    subscriber.complete();
                });
        });
    }

    public sortUsersJournalsByLastUpdated$(id: string, order: 1 | -1): Observable<Journal[]> {
        return new Observable((subscriber) => {
            JournalModel.find({author: id}).sort({lastUpdated: order})
                .then((journal: Journal[]) => {
                    subscriber.next(journal);
                    subscriber.complete();
                });
        });
    }

    public createJournal$(userId: string, name: string): Observable<Journal> {
        return new Observable<Journal>((subscriber) => {
            new JournalModel({
                name: name,
                author: userId,
                dateCreated: now(),
                lastUpdated: now(),
            }).save((error, journal: Journal) => {
                subscriber.next(journal)
                subscriber.complete();
            });
        });
    }

    public deleteJournal$(id: string): Observable<Journal> {
        return new Observable<Journal>((subscriber) => {
            this.deleteJournalEntries$(id).subscribe();
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
    }

    private deleteJournalEntries$(journalID: string): Observable<void> {
        return new Observable((subscriber) => {
            JournalEntryModel.deleteMany({journal: journalID}, (error, result) => {
                if (error)
                    subscriber.error(error);
                subscriber.complete();
            });
        });
    }

    public updateJournal$(id: string, name: string): Observable<Journal> {
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
        })
    }
}