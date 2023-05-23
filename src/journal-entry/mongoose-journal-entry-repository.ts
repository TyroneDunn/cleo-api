import {JournalEntryRepository} from "./journal-entry-repository.type";
import JournalEntryModel, {JournalEntryDocument} from "./journal-entry-model";
import {now} from "mongoose";
import {Observable} from "rxjs";
import {JournalEntry} from "./journal-entry.type";
import {isValidObjectId} from "../utils/isValidObjectId";

export class MongooseJournalEntryRepository implements JournalEntryRepository {
    public entry$(id: string): Observable<JournalEntry | undefined> {
        return new Observable((subscriber) => {
            if (!isValidObjectId(id)) {
               subscriber.next(undefined);
               subscriber.complete();
               return;
            }
            JournalEntryModel.findById(id).then((entry: JournalEntry | undefined) => {
                subscriber.next(entry);
                subscriber.complete();
            })
        });
    }

    public entries$(
        id: string,
        page: number,
        limit: number,
        ): Observable<JournalEntry[]> {
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
    }

    public sortEntriesByLastUpdated$(
        id: string, 
        order: 1 | -1, 
        page: number, 
        limit: number
    ): Observable<JournalEntry[]> {
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
    }
    
    public createEntry$(journalId: string, body: string): Observable<JournalEntry> {
        return new Observable<JournalEntry>((subscriber) => {
            new JournalEntryModel({
                body: body,
                journal: journalId,
                dateCreated: now(),
                lastUpdated: now(),
            }).save((error, entry: JournalEntry) => {
                subscriber.next(entry);
                subscriber.complete();
            });
        });
    }

    public deleteEntry$(id: string): Observable<JournalEntry> {
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
    }

    public updateEntry$(id: string, body: string): Observable<JournalEntry | undefined> {
        return new Observable((subscriber) => {
            JournalEntryModel.findByIdAndUpdate(
                id,
                {body: body, lastUpdated: now()},
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
    }
}