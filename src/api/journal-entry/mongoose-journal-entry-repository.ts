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

    public journalEntryExists$(id: string): Observable<boolean> {
        return new Observable((subscriber) => {
            if (!this.isValidObjectId(id)) {
                subscriber.next(false);
                subscriber.complete();
                return;
            }

            JournalEntryModel.exists({_id: new ObjectId(id)}).then((result) => {
                if (!result) {
                    subscriber.next(false);
                    subscriber.complete();
                    return;
                }
                subscriber.next(true);
                subscriber.complete();
            })
        });
    }
    
    async getEntry(id: string): Promise<JournalEntryDocument> {
        return JournalEntryModel.findById(id);
    }

    async getEntries(journalID: string): Promise<JournalEntryDocument[]> {
        return JournalEntryModel.find({journal: journalID});
    }

    async createEntry(journalId: string, body: string): Promise<JournalEntryDocument> {
        const newEntry = new JournalEntryModel({
            body: body,
            journal: journalId,
            dateOfCreation: now(),
            lastUpdated: now(),
        });
        await newEntry.save()
        return newEntry;
    }

    async deleteEntry(journalId: string, entryId: string): Promise<void> {
        const entry = await JournalEntryModel.findById(entryId);
        await entry.delete();
    }
    async updateEntry(id: string, body: string): Promise<JournalEntryDocument> {
        await JournalEntryModel.findOneAndUpdate({_id: id}, {body: body, lastUpdated: now()});
        return JournalEntryModel.findById(id);
    }

    async journalEntryExists(id: string): Promise<boolean> {
        try {
            const entry = await JournalEntryModel.findById(id);
            return entry !== null;
        } catch (e) {
            return false;
        }
    }
}