import database from "../utils/mongoose-database";
import {Document, Schema} from 'mongoose';
import {JournalEntry} from "./journal-entry.type";

export interface JournalEntryDocument extends Document, JournalEntry {
    _id: string,
    body: string,
    journal: Schema.Types.ObjectId;
    dateOfCreation: Date,
    lastUpdated: Date,
}

const journalEntrySchema = new Schema({
    body: {
        type: String,
        required: true
    },
    journal: {
        type: Schema.Types.ObjectId,
        ref: "JournalSchema",
        required: true,
    },
    dateOfCreation: Date,
    lastUpdated: Date,
});

const JournalEntryModel = database.model<JournalEntryDocument>('JournalEntry', journalEntrySchema);
export default JournalEntryModel;
