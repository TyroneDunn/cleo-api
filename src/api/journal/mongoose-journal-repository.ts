import {JournalRepository} from "./journal-repository.type";
import JournalModel from './journal-model'
import JournalEntryModel from "../journal-entry/journal-entry-model";
import {now, ObjectId} from "mongoose";
import {Observable} from "rxjs";
import {Journal} from "./journal.type";

const ObjectId = require('mongoose').Types.ObjectId;

export class MongooseJournalRepository implements JournalRepository {
    public journal$(id: string): Observable<Journal | undefined> {
        return new Observable((subscriber) => {
            if (!this.isValidObjectId(id)) {
                subscriber.next(undefined);
                subscriber.complete();
                return;
            }

            JournalModel.findById(id).then((journal: Journal) => {
                subscriber.next(journal);
                subscriber.complete();
            });
        });
    }

    private isValidObjectId(id: string): boolean {
        return ObjectId.isValid(id);
    }

    public journals$(userId: string): Observable<Journal[]> {
        return new Observable((subscriber) => {
            JournalModel.find({author: userId}).then((journals: Journal[]) => {
                subscriber.next(journals);
                subscriber.complete();
            });
        });
    }

    public createJournal$(userId: string, name: string): Observable<Journal> {
        return new Observable<Journal>((subscriber) => {
            const journal = new JournalModel({
                name: name,
                author: userId,
                dateOfCreation: now(),
                lastUpdated: now(),
            });
            journal.save().then(() => {
                subscriber.next(journal)
                subscriber.complete();
            });
        });
    }

    public deleteJournal$(id: string): Observable<Journal> {
        return new Observable((subscriber) => {
            JournalModel.findById(id).then((journal) => {
                this.deleteJournalEntries(id).then(() => {
                    journal.delete().then(() => {
                        subscriber.next(journal);
                        subscriber.complete();
                    });
                });
            });
        });
    }

    private async deleteJournalEntries(journalID: string): Promise<void> {
        const journalEntries = await JournalEntryModel.find({journal: journalID});
        await journalEntries.map(entry => entry.delete());
    }

    public updateJournal$(id: string, name: string): Observable<Journal> {
        return new Observable((subscriber) => {
            JournalModel.findByIdAndUpdate(id, {name: name, lastUpdated: now()}).then((journal) => {
                JournalModel.findById(id).then((journal) => {
                    subscriber.next(journal);
                    subscriber.complete();
                });
            });
        })
    }

    public journalExists$(id: string): Observable<boolean> {
        return new Observable<boolean>((subscriber) => {
            if (!this.isValidObjectId(id)){
                subscriber.next(false);
                subscriber.complete();
                return;
            }

            JournalModel.exists({_id: new ObjectId(id)}).then((result) => {
                if (!result) {
                    subscriber.next(false);
                    subscriber.complete();
                    return;
                }
                subscriber.next(true);
                subscriber.complete();
            });
        });
    }
}