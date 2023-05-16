import database from "../../utils/mongoose-database";
import {Document, Schema} from 'mongoose';
import {Journal} from "./journal.type";

export interface JournalDocument extends Document, Journal {
  name: string,
  author: Schema.Types.ObjectId;
  dateOfCreation: Date,
  lastUpdated: Date,
}

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
  dateOfCreation: Date,
  lastUpdated: Date,
});

const JournalModel = database.model<JournalDocument>('Journal', journalSchema);
export default JournalModel;
