import {JournalEntryRepository} from "./journal-entry-repository.type";
import JournalEntryModel, {JournalEntryDocument} from "./journal-entry-model";
import {now} from "mongoose";

export class MongooseJournalEntryRepository implements JournalEntryRepository {
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