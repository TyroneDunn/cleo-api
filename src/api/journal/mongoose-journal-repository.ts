import {JournalRepository} from "./journal-repository.type";
import JournalModel, {JournalDocument} from './journal-model'
import JournalEntryModel from "../journal-entry/journal-entry-model";
const ObjectId = require('mongoose').Types.ObjectId;
import {now} from "mongoose";
import {Observable, of} from "rxjs";
import {Journal} from "./journal.type";
import {BadRequestError} from "../../utils/BadRequestError"

export class MongooseJournalRepository implements JournalRepository {
    public journal$(id: string): Observable<Journal | undefined> {
        return new Observable((subscriber) => {
            if (!ObjectId.isValid(id)) {
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

    async journalExists(id: string): Promise<boolean> {
        try {
            const journal = await JournalModel.findById(id);
            return journal !== null;
        } catch (e) {
            return false;
        }
    }
}