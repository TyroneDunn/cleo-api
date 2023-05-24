import database from "../utils/mongoose-database";
import {Document, Schema} from 'mongoose';
import {JournalEntry} from "./journal-entry.type";

interface JournalEntryDocument extends Document, JournalEntry {
    _id: string,
    body: string,
    journal: Schema.Types.ObjectId;
    dateCreated: Date,
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
    dateCreated: {
        type: Date,
        required: true,
    },
    lastUpdated: {
        type: Date,
        required: true,
    },
});

const JournalEntryModel = database.model<JournalEntryDocument>('JournalEntry', journalEntrySchema);
export default JournalEntryModel;
