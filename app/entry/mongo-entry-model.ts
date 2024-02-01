import {Entry} from "./entry";
import {Document, Schema} from 'mongoose';
import database from "../database/mongoose-database";

interface EntryDocument extends Document, Entry {
    _id: string,
    body: string,
    title: string,
    journal: Schema.Types.ObjectId;
    dateCreated: Date,
    lastUpdated: Date,
}

const EntrySchema = new Schema({
    body: {
        type: String,
    },
    title: {
        type: String,
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

const EntryModel = database.model<EntryDocument>('Entry', EntrySchema);
export default EntryModel;