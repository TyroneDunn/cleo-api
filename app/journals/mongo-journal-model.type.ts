import { Journal } from "./journals.types";
import { Document, Schema } from 'mongoose';
import database from '../database/mongoose-database';

interface JournalDocument extends Document, Journal {
   _id    : string,
   name   : string,
   author : string;
}

const journalSchema = new Schema<JournalDocument>(
   {
      name  : {
         type     : String,
         required : true,
      },
      author: {
         type     : String,
         required : true,
      },
   },
   {
      timestamps : true,
      toObject   : { virtuals: true },
   });

journalSchema.virtual('journals-author', {
   ref          : 'User',
   localField   : 'author',
   foreignField : 'username',
   justOne      : true,
});

const JournalModel = database.model<JournalDocument>('Journal', journalSchema);
export default JournalModel;
