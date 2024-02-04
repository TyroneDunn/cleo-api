import {Entry} from "./entries.types";
import {Document, Schema} from 'mongoose';
import database from "../database/mongoose-database";

interface EntryDocument extends Document, Entry {
    _id: string,
    body: string,
    title: string,
    journal: Schema.Types.ObjectId;
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
},
{
    timestamps: true,
});

const EntryModel = database.model<EntryDocument>('Entry', EntrySchema);
export default EntryModel;
