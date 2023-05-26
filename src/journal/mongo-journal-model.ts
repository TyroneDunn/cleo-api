import {Journal} from "./journal.type";
import {Document, Schema} from 'mongoose';
import database from "../utils/mongoose-database";

export interface JournalDocument extends Document, Journal {
  _id: string,
  name: string,
  author: Schema.Types.ObjectId;
  dateCreated: Date,
  lastUpdated: Date,
};

const journalSchema = new Schema<JournalDocument>({
  name: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
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

const JournalModel = database.model<JournalDocument>('Journal', journalSchema);
export default JournalModel;
