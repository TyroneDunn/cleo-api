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

    async createJournal(userId: string, name: string): Promise<JournalDocument> {
        const journal = new JournalModel({
            name: name,
            author: userId,
            dateOfCreation: now(),
            lastUpdated: now(),
        });
        await journal.save();
        return journal;
    }

    async deleteJournal(id: string): Promise<void> {
        const journal = await JournalModel.findById(id);
        await this.deleteJournalEntries(id);
        await journal.delete();
    }

    private async deleteJournalEntries(journalID: string): Promise<void> {
        const journalEntries = await JournalEntryModel.find({journal: journalID});
        await journalEntries.map(entry => entry.delete());
    }

    async updateJournal(id: string, name: string): Promise<JournalDocument> {
        const journal = await JournalModel.findById(id);
        await journal.updateOne({name: name, lastUpdated: now()});
        return JournalModel.findById(id);
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