import {
    EntriesRepository,
    FilterArgs,
    PaginationArgs,
    QueryArgs,
    SortArgs
} from "./entries-repository";
import {Entry} from "./entry";
import EntryModel from "./mongo-entry-model";
import JournalModel from "../journal/mongo-journal-model";
import {Journal} from "../journal/journal";
import {now} from "mongoose";

type GetEntriesOptions = {
    _id?: any,
    journal?: any,
    body?: any,
    dateCreated?: any,
    lastUpdated?: any,
};

const buildGetEntriesOptions = (queryArgs: QueryArgs, filterArgs: FilterArgs) => {
    let options: GetEntriesOptions = {};
    if (queryArgs.journal)
        options.journal = queryArgs.journal;
    if (queryArgs.journalRegex)
        options.journal = {$regex: queryArgs.journal, $options: 'i'};
    if (queryArgs.body)
        options.body = queryArgs.body;
    if (queryArgs.bodyRegex)
        options.body = {$regex: queryArgs.bodyRegex, $options: 'i'};
    if (queryArgs.id)
        options._id = queryArgs.id;
    if (queryArgs.idRegex)
        options._id = {$regex: queryArgs.idRegex, $options: 'i'};
    if (filterArgs.startDate && !filterArgs.endDate)
        options.dateCreated = {$gt: filterArgs.startDate};
    if (!filterArgs.startDate && filterArgs.endDate)
        options.dateCreated = {$lt: filterArgs.endDate};
    if (filterArgs.startDate && filterArgs.endDate)
        options.dateCreated = {$gte: filterArgs.startDate, $lte: filterArgs.endDate};
    return options;
};

export const MongoEntriesRepository: EntriesRepository = {
    getEntry: async (args: QueryArgs): Promise<Entry> =>
        EntryModel.findById(args.id),

    getEntries: async (
        queryArgs: QueryArgs,
        sortArgs: SortArgs,
        filterArgs: FilterArgs,
        paginationArgs: PaginationArgs
    ): Promise<Entry[]> => {
        const skip = (paginationArgs.page - 1) * paginationArgs.limit;
        const options = buildGetEntriesOptions(queryArgs, filterArgs);
        return EntryModel.find(options)
            .sort({[sortArgs.sort]: sortArgs.order})
            .skip(skip)
            .limit(paginationArgs.limit);
    },

    createEntry: (args: QueryArgs): Promise<Entry> =>
        new EntryModel({
            body: args.body,
            journal: args.journal,
            dateCreated: now(),
            lastUpdated: now(),
        }).save(),


    deleteEntry: async (args: QueryArgs): Promise<Entry> => {
        return EntryModel.findByIdAndDelete(args.id);
    },

    updateEntry: async (args: QueryArgs): Promise<Entry> =>
        EntryModel.findByIdAndUpdate(
            args.id,
            {
                body: args.body,
                lastUpdated: now()
            },
            {new: true}
        ),


    exists: async (args: QueryArgs): Promise<boolean> => {
        try {
            const entry = await EntryModel.findOne({_id: args.id});
            return !!entry;
        } catch (error) {
            return false;
        }
    },

    ownsEntry: async (args: QueryArgs): Promise<boolean> => {
        try {
            const entry: Entry = await EntryModel.findById(args.id);
            const journal: Journal = await JournalModel.findById(entry.journal);
            return journal.author.toString() === args.userId;
        } catch (error) {
            return false;
        }
    }
};
