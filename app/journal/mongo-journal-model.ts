import {Journal} from "./journal";
import {Document, Schema} from 'mongoose';
import database from '../database/mongoose-database';

interface JournalDocument extends Document, Journal {
  _id: string,
  name: string,
  author: string;
  dateCreated: Date,
  lastUpdated: Date,
}

const journalSchema = new Schema<JournalDocument>({
  name: {
    type: String,
    required: true
  },
  author: {
    type: String,
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
},
{
  toObject: {virtuals: true}
});

journalSchema.virtual('journal-author', {
  ref: 'User',
  localField: 'author',
  foreignField: 'username',
  justOne: true
});

const JournalModel = database.model<JournalDocument>('Journal', journalSchema);
export default JournalModel;
