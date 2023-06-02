import {Journal} from "./journal.type"
import JournalModel from './mongo-journal-model';
import JournalEntryModel from "../entry/mongo-entry-model";
import {now} from "mongoose";
import {
    FilterArgs,
    JournalsRepository,
    PaginationArgs,
    QueryArgs,
    SortArgs
} from "./journals-repository";

const buildGetJournalsOptions = (queryArgs: QueryArgs, filterArgs: FilterArgs) => {
    let options;
    if (queryArgs.author) options.author = queryArgs.author;
    if (queryArgs.name) options.name = queryArgs.name;
    if (queryArgs.idRegex) options.id = {$regex: queryArgs.idRegex, $options: 'i'};
    if (queryArgs.authorRegex) options.id = {$regex: queryArgs.authorRegex, $options: 'i'};
    if (queryArgs.nameRegex) options.id = {$regex: queryArgs.nameRegex, $options: 'i'};

    if (filterArgs.startDate && !filterArgs.endDate)
        options.dateCreated = {$gt: filterArgs.startDate}

    if (!filterArgs.startDate && filterArgs.endDate)
        options.dateCreated = {$lt: filterArgs.endDate}

    if (filterArgs.startDate && filterArgs.endDate)
        options.dateCreated = {$gte: filterArgs.startDate, $lte: filterArgs.endDate}

    return options;
};

const deleteJournalEntries = async (journalID: string): Promise<void> => {
    await JournalEntryModel.deleteMany({journal: journalID});
}

export const MongoJournalsRepository: JournalsRepository = {
    getJournal: async (args: QueryArgs): Promise<Journal> =>
        JournalModel.findById(args.id),
    getJournals: async (
        queryArgs: QueryArgs,
        sortArgs: SortArgs,
        filterArgs: FilterArgs,
        paginationArgs: PaginationArgs): Promise<Journal[]> => {
        const skip = (paginationArgs.page - 1) * paginationArgs.limit;
        const options = buildGetJournalsOptions(queryArgs, filterArgs);
        return JournalModel.find(options)
            .sort({[sortArgs.sort]: sortArgs.order})
            .skip(skip)
            .limit(paginationArgs.limit);
    },

    createJournal: async (args: QueryArgs): Promise<Journal> =>
         new JournalModel({
            name: args.name,
            author: args.author,
            dateCreated: now(),
            lastUpdated: now(),
        }).save(),

    deleteJournal: async (args: QueryArgs): Promise<Journal> => {
        await deleteJournalEntries(args.id);
        return JournalModel.findByIdAndDelete(args.id);
    },

    updateJournal: async (args: QueryArgs): Promise<Journal> =>
        JournalModel.findByIdAndUpdate(
            args.id,
            {
                name: args.name,
                lastUpdated: now()
            },
            {new: true}
        ),

    exists: async (args: QueryArgs): Promise<boolean> => {
        try {
            const journal = await JournalModel.findOne({_id: args.id});
            return !!journal;
        } catch (error) {
            return false;
        }
    },

    ownsJournal(args: QueryArgs): Promise<boolean> {
        return Promise.resolve(false);
    }
}
