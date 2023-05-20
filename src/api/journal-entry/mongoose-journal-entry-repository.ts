import {JournalEntryRepository} from "./journal-entry-repository.type";
import JournalEntryModel, {JournalEntryDocument} from "./journal-entry-model";
import {now, ObjectId} from "mongoose";
const ObjectId = require('mongoose').Types.ObjectId;
import {Observable, of} from "rxjs";
import {JournalEntry} from "./journal-entry.type";

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

    private isValidObjectId(id: string): boolean {
        return ObjectId.isValid(id);
    }

    public journalEntryExists$(id: string): Observable<boolean> {
        return new Observable((subscriber) => {
            let objectId: ObjectId;
            try {
                objectId = new ObjectId(id);
                JournalEntryModel.exists({_id: objectId}).then((result) => {
                    if (!result) {
                        subscriber.next(false);
                        subscriber.complete();
                        return;
                    }
                    subscriber.next(true);
                    subscriber.complete();
                })
            } catch (e) {
                subscriber.next(false);
                subscriber.complete();
            }
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