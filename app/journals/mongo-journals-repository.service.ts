import {
    Journal,
    JournalsFilter,
    GetJournalRequest,
    GetJournalsRequest,
    CreateJournalRequest,
    UpdateJournalRequest,
    DeleteJournalRequest,
    DeleteJournalsRequest,
} from "./journals.types";
import JournalModel from './mongo-journal-model.type';
import JournalEntryModel from "../entries/mongo-entry-model.type";
import { JournalsRepository } from "./journals-repository.type";
import { CommandResult, Error } from '@hals/common';
import { GetRecordsResponse } from '../shared/get-records-response.type';
import { DeleteResult } from "mongodb";

export const MongoJournalsRepository: JournalsRepository = {
    getJournal: async (request: GetJournalRequest): Promise<Journal | Error> => {
        try {
            const journal: Journal | null = await JournalModel.findById(request.id);
            if (!journal) return Error('NotFound', 'Journal not found.');
            else return journal;
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    getJournals: async (request: GetJournalsRequest): Promise<GetRecordsResponse<Journal> | Error> => {
        try {
            const filter = mapToJournalsFilter(request.filter);
            const count = await JournalModel.countDocuments(filter);
            const query = JournalModel.find(filter)
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

    createJournal: async (request: CreateJournalRequest): Promise<Journal | Error> => {
        try {
            return new JournalModel({
                name       : request.name,
                author     : request.author,
            }).save();
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    updateJournal: async (request: UpdateJournalRequest): Promise<Journal | Error> => {
        try {
            const journal: Journal | null = await JournalModel.findByIdAndUpdate(
               request.id,
               { ...request.name && { name: request.name } },
               { new: true },
            );
            if (!journal) return Error('NotFound', 'Journal not found.');
            else return journal;
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    deleteJournal: async (request: DeleteJournalRequest): Promise<CommandResult | Error> => {
        try {
            await deleteJournalEntries(request.id);
            const result: DeleteResult = await JournalModel.deleteOne({_id: request.id});
            return CommandResult(result.acknowledged, result.deletedCount);
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    deleteJournals: async (request: DeleteJournalsRequest): Promise<CommandResult | Error> => {
        try {
            const filter = mapToJournalsFilter(request.filter);
            const result: DeleteResult = await JournalModel.deleteMany(filter);
            return CommandResult(result.acknowledged, result.deletedCount);
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    exists: async (id: string): Promise<boolean | Error> => {
        try {
            const journal: Journal | null = await JournalModel.findById(id);
            return !!journal;
        } catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    ownsJournal: async (author: string, id: string): Promise<boolean | Error> => {
        try {
            const journal: Journal | null = await JournalModel.findById(id);
            if (journal === null)
                return Error("NotFound", `Journal ${id} not found.`);
            return journal.author === author;
        } catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },
};

const deleteJournalEntries = async (journal: string): Promise<void> => {
    await JournalEntryModel.deleteMany({journal: journal});
};

const mapToJournalsFilter = (filter: JournalsFilter | undefined) => ({
    ... filter && {
        ... filter.name && {name: filter.name},
        ... filter.nameRegex && {name: {$regex: filter.nameRegex, $options: 'i'}},
        ... filter.author && {author: filter.author},
        ... filter.authorRegex && {author: {$regex: filter.authorRegex, $options: 'i'}},
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
        }
    },
});
