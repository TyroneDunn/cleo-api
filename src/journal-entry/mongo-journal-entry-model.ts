import {Entry} from "./entry.type";
import {Document, Schema} from 'mongoose';
import database from "../utils/mongoose-database";

interface EntryDocument extends Document, Entry {
    _id: string,
    body: string,
    journal: Schema.Types.ObjectId;
    dateCreated: Date,
    lastUpdated: Date,
};

const EntrySchema = new Schema({
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

const JournalEntryModel = database.model<EntryDocument>('JournalEntry', EntrySchema);
export default JournalEntryModel;
