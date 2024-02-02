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

    getJournals: async (dto: GetJournalsRequest): Promise<GetRecordsResponse<Journal> | Error> => {
        try {
            const filter = mapToJournalsFilter(dto);
            const count = await JournalModel.count(filter);
            const journals: Journal[] = await JournalModel.find(filter)
              .sort({[dto.sort]: (dto.order === 'asc')? 1 : -1})
              .skip(dto.page * dto.limit)
              .limit(dto.limit);
            return {
                count: count,
                collection: journals,
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

const mapToJournalsFilter = (dto: GetJournalsRequest) => ({
    ... dto.name && {name: dto.name},
    ... dto.nameRegex && {name: {$regex: dto.nameRegex, $options: 'i'}},
    ... dto.author && {author: dto.author},
    ... dto.authorRegex && {author: {$regex: dto.authorRegex, $options: 'i'}},
    ... (dto.startDate && !dto.endDate) && {lastUpdated: {$gt: dto.startDate}},
    ... (!dto.startDate && dto.endDate) && {lastUpdated: {$lt: dto.endDate}},
    ... (dto.startDate && dto.endDate) && {lastUpdated: {$gte: dto.startDate, $lte: dto.endDate}},
});
