import {
    CreateJournalRequest,
    DeleteJournalRequest,
    DeleteJournalsRequest,
    GetJournalRequest,
    GetJournalsRequest,
    Journal,
    UpdateJournalRequest,
} from "./journals.types";
import JournalModel from './mongo-journal-model.type';
import JournalEntryModel from "../entry/mongo-entry-model";
import { now } from "mongoose";
import { JournalsRepository } from "./journals-repository.type";
import { CommandResult, Error } from '@hals/common';
import { GetRecordsResponse } from '../shared/get-records-response.type';
import { DeleteResult } from "mongodb";

export const MongoJournalsRepository: JournalsRepository = {
    getJournal: async (dto: GetJournalRequest): Promise<Journal | Error> => {
        try {
            const journal: Journal | null = await JournalModel.findById(dto.id);
            if (!journal) return Error('NotFound', 'Journal not found.');
            else return journal;
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    getJournals: async (request: GetJournalsRequest): Promise<GetRecordsResponse<Journal> | Error> => {
        try {
            const filter = mapToJournalsFilter(request);
            const count = await JournalModel.count(filter);
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

    createJournal: async (dto: CreateJournalRequest): Promise<Journal | Error> => {
        try {
            return new JournalModel({
                name       : dto.name,
                author     : dto.author,
                dateCreated: now(),
                lastUpdated: now(),
            }).save();
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    updateJournal: async (dto: UpdateJournalRequest): Promise<Journal | Error> => {
        try {
            const journal: Journal | null = await JournalModel.findByIdAndUpdate(
               dto.id,
               {
                   ...dto.name && { name: dto.name },
                   lastUpdated: now(),
               },
               { new: true },
            );
            if (!journal) return Error('NotFound', 'Journal not found.');
            else return journal;
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    deleteJournal: async (dto: DeleteJournalRequest): Promise<CommandResult | Error> => {
        try {
            await deleteJournalEntries(dto.id);
            const result: DeleteResult = await JournalModel.deleteOne({_id: dto.id});
            return CommandResult(result.acknowledged, result.deletedCount);
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    deleteJournals: async (dto: DeleteJournalsRequest): Promise<CommandResult | Error> => {
        try {
            const filter = mapToJournalsFilter(dto);
            const result: DeleteResult = await JournalModel.deleteMany(filter);
            return CommandResult(result.acknowledged, result.deletedCount);
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    exists: async (id: string): Promise<boolean | Error> => {
        try {
            const journal: Journal = await JournalModel.findById(id);
            return !!journal;
        } catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    ownsJournal: async (author: string, id: string): Promise<boolean | Error> => {
        try {
            const journal: Journal = await JournalModel.findById(id);
            return journal.author === author;
        } catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },
};

const deleteJournalEntries = async (journal: string): Promise<void> => {
    await JournalEntryModel.deleteMany({journal: journal});
};

const mapToJournalsFilter = (request: GetJournalsRequest) => ({
    ... request.filter && {
        ... request.filter.name && {name: request.filter.name},
        ... request.filter.nameRegex && {name: {$regex: request.filter.nameRegex, $options: 'i'}},
        ... request.filter.author && {author: request.filter.author},
        ... request.filter.authorRegex && {author: {$regex: request.filter.authorRegex, $options: 'i'}},
        ... request.filter.timestamps && {
            ... request.filter.timestamps.createdAt && {
                ... (request.filter.timestamps.createdAt.start && !request.filter.timestamps.createdAt.end) && {createdAt: {$gt: request.filter.timestamps.createdAt.start}},
                ... (!request.filter.timestamps.createdAt.start && request.filter.timestamps.createdAt.end) && {createdAt: {$lt: request.filter.timestamps.createdAt.end}},
                ... (request.filter.timestamps.createdAt.start && request.filter.timestamps.createdAt.end) && {createdAt: {$gte: request.filter.timestamps.createdAt.start, $lte: request.filter.timestamps.createdAt.end}},
            },
            ... request.filter.timestamps.updatedAt && {
                ... (request.filter.timestamps.updatedAt.start && !request.filter.timestamps.updatedAt.end) && {updatedAt: {$gt: request.filter.timestamps.updatedAt.start}},
                ... (!request.filter.timestamps.updatedAt.start && request.filter.timestamps.updatedAt.end) && {updatedAt: {$lt: request.filter.timestamps.updatedAt.end}},
                ... (request.filter.timestamps.updatedAt.start && request.filter.timestamps.updatedAt.end) && {updatedAt: {$gte: request.filter.timestamps.updatedAt.start, $lte: request.filter.timestamps.updatedAt.end}},
            },
        }
    },
});
