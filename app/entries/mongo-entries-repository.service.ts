import { EntriesRepository } from "./entries-repository.type";
import {
    Entry,
    EntriesFilter,
    GetEntryRequest,
    GetEntriesRequest,
    CreateEntryRequest,
    UpdateEntryRequest,
    DeleteEntryRequest,
    DeleteEntriesRequest,
} from "./entries.types";
import EntryModel from "./mongo-entry-model.type";
import JournalModel from "../journals/mongo-journal-model.type";
import { Journal } from "../journals/journals.types";
import { CommandResult, Error } from '@hals/common';
import { GetRecordsResponse } from '../shared/get-records-response.type';
import { DeleteResult } from 'mongodb';

export const MongoEntriesRepository: EntriesRepository = {
    getEntry: async (request: GetEntryRequest): Promise<Entry | Error> => {
        try {
            const entry: Entry | null = await EntryModel.findById(request.id);
            if (!entry) return Error('NotFound', 'Entry not found.');
            else return entry;
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    getEntries: async (request: GetEntriesRequest): Promise<GetRecordsResponse<Entry> | Error> => {
        try {
            const filter = mapToEntriesFilter(request.filter);
            const count = await EntryModel.count(filter);
            const query = EntryModel.find(filter);
            if (request.sort !== undefined)
                query.sort({ [request.sort.sortBy]: request.sort.order === 'asc' ? 1 : -1 });
            if (request.page !== undefined) {
                query.skip(request.page.index * request.page.limit);
                query.limit(request.page.limit);
            }
            return {
                count: count,
                collection: await query.exec(),
            };
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    createEntry: async (request: CreateEntryRequest): Promise<Entry | Error> => {
        try {
            return new EntryModel({
                title      : request.title,
                body       : request.body,
                journal    : request.journal,
            }).save();
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    updateEntry: async (dto: UpdateEntryRequest): Promise<Entry | Error> => {
        try {
            const entry: Entry | null = await EntryModel.findByIdAndUpdate(
               dto.id,
               mapToUpdateEntryQuery(dto),
               {new: true}
            );
            if (!entry) return Error("NotFound", 'Entry not found.');
            return entry;
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    deleteEntry: async (dto: DeleteEntryRequest): Promise<CommandResult | Error> => {
        try {
            const result: DeleteResult = await EntryModel.deleteOne({ _id: dto.id });
            return CommandResult(result.acknowledged, result.deletedCount);
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    deleteEntries: async (request: DeleteEntriesRequest): Promise<CommandResult | Error> => {
        try {
            const filter = mapToEntriesFilter(request.filter);
            const result: DeleteResult = await EntryModel.deleteMany(filter);
            return CommandResult(result.acknowledged, result.deletedCount);
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    exists: async (id: string): Promise<boolean | Error> => {
        try {
            const entry: Entry | null = await EntryModel.findById(id);
            return !!entry;
        } catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    ownsEntry: async (author: string, id: string): Promise<boolean | Error> => {
        try {
            const entry: Entry | null = await EntryModel.findById(id);
            if (entry === null)
                return Error("NotFound", `Entry ${id} not found.`);
            const journal: Journal | null = await JournalModel.findById(entry.journal);
            if (journal === null)
                return Error("NotFound", `Entry's journal not found.`);
            return journal.author.toString() === author;
        } catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },
};

const mapToEntriesFilter = (filter: EntriesFilter) => {
    if (filter.titleRegex && filter.bodyRegex) {
        return ({
            "$or": [
                {title: {$regex: filter.titleRegex, $options: 'i'}},
                {body: {$regex: filter.bodyRegex, $options: 'i'}},
            ],
            ...filter.journal && {journal: filter.journal},
            ...filter.title && {title: filter.title},
            ...filter.body && {body: filter.body},
            ... filter.timestamps && {
                ... filter.timestamps.createdAt && {
                    ... (filter.timestamps.createdAt.start && !filter.timestamps.createdAt.end) && {createdAt: {$gt: filter.timestamps.createdAt.start}},
                    ... (!filter.timestamps.createdAt.start && filter.timestamps.createdAt.end) && {createdAt: {$lt: filter.timestamps.createdAt.end}},
                    ... (filter.timestamps.createdAt.start && filter.timestamps.createdAt.end) && {createdAt: {$gte: filter.timestamps.createdAt.start, $lte: filter.timestamps.createdAt.end}},
                },
                ... filter.timestamps.updatedAt && {
                    ... (filter.timestamps.updatedAt.start && !filter.timestamps.updatedAt.end) && {updatedAt: {$gt: filter.timestamps.updatedAt.start}},
                    ... (!filter.timestamps.updatedAt.start && filter.timestamps.updatedAt.end) && {updatedAt: {$lt: filter.timestamps.updatedAt.end}},
                    ... (filter.timestamps.updatedAt.start && filter.timestamps.updatedAt.end) && {updatedAt: {$gte: filter.timestamps.updatedAt.start, $lte: filter.timestamps.updatedAt.end}},
                },
            },
        })
    } else
        return ({
            ...filter.journal && {journal: filter.journal},
            ...filter.title && {title: filter.title},
            ...filter.titleRegex && {title: {$regex: filter.titleRegex, $options: 'i'}},
            ...filter.body && {body: filter.body},
            ...filter.bodyRegex && {body: {$regex: filter.bodyRegex, $options: 'i'}},
            ... filter.timestamps && {
                ... filter.timestamps.createdAt && {
                    ... (filter.timestamps.createdAt.start && !filter.timestamps.createdAt.end) && {createdAt: {$gt: filter.timestamps.createdAt.start}},
                    ... (!filter.timestamps.createdAt.start && filter.timestamps.createdAt.end) && {createdAt: {$lt: filter.timestamps.createdAt.end}},
                    ... (filter.timestamps.createdAt.start && filter.timestamps.createdAt.end) && {createdAt: {$gte: filter.timestamps.createdAt.start, $lte: filter.timestamps.createdAt.end}},
                },
                ... filter.timestamps.updatedAt && {
                    ... (filter.timestamps.updatedAt.start && !filter.timestamps.updatedAt.end) && {updatedAt: {$gt: filter.timestamps.updatedAt.start}},
                    ... (!filter.timestamps.updatedAt.start && filter.timestamps.updatedAt.end) && {updatedAt: {$lt: filter.timestamps.updatedAt.end}},
                    ... (filter.timestamps.updatedAt.start && filter.timestamps.updatedAt.end) && {updatedAt: {$gte: filter.timestamps.updatedAt.start, $lte: filter.timestamps.updatedAt.end}},
                },
            },
        });
};

const mapToUpdateEntryQuery = (request: UpdateEntryRequest) => ({
    ... request.title && {title: request.title},
    ... request.body && {body: request.body},
    ... request.journal && {journal: request.journal},
});
