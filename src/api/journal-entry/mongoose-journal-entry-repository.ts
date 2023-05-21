import {JournalEntryRepository} from "./journal-entry-repository.type";
import JournalEntryModel, {JournalEntryDocument} from "./journal-entry-model";
import {now} from "mongoose";
import {Observable} from "rxjs";
import {JournalEntry} from "./journal-entry.type";
const ObjectId = require('mongoose').Types.ObjectId;

export class MongooseJournalEntryRepository implements JournalEntryRepository {
    public entry$(id: string): Observable<JournalEntry | undefined> {
        return new Observable((subscriber) => {
            if (!this.isValidObjectId(id)) {
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
    
    public entries$(journalId: string): Observable<JournalEntry[]> {
        return new Observable((subscriber) => {
            JournalEntryModel.find({journal: journalId})
                .then((entries: JournalEntry[]) => {
                    subscriber.next(entries);
                    subscriber.complete();
                });
        })
    }

    public createEntry$(journalId: string, body: string): Observable<JournalEntry> {
        return new Observable<JournalEntry>((subscriber) => {
            new JournalEntryModel({
                body: body,
                journal: journalId,
                dateOfCreation: now(),
                lastUpdated: now(),
            }).save().then((entry) => {
                subscriber.next(entry);
                subscriber.complete();
            })
        });
    }

    public deleteEntry$(journalId: string, entryId: string): Observable<JournalEntry> {
        return new Observable((subscriber) => {
            JournalEntryModel.findByIdAndDelete(entryId, (error, entry) => {
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

    private isValidObjectId(id: string): boolean {
        return ObjectId.isValid(id);
    }
}