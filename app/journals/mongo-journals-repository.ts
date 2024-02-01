import {Journal} from "./journals.types"
import JournalModel from './mongo-journal-model';
import JournalEntryModel from "../entry/mongo-entry-model";
import {now} from "mongoose";
import {JournalsRepository} from "./journals-repository";
import {
    CreateJournalDTO,
    DeleteJournalDTO,
    DeleteJournalsDTO,
    GetJournalDTO,
    GetJournalsDTO,
    UpdateJournalDTO
} from "./journals-dtos";
import {PaginatedResponse} from "../utils/paginated-response";

const deleteJournalEntries = async (journal: string): Promise<void> => {
    await JournalEntryModel.deleteMany({journal: journal});
};

export const MongoJournalsRepository: JournalsRepository = {
    getJournal: async (dto: GetJournalDTO): Promise<Journal> =>
        JournalModel.findById(dto.id),

    getJournals: async (dto: GetJournalsDTO): Promise<PaginatedResponse<Journal>> => {
        const skip = (dto.page) * dto.limit;
        const filter = mapToJournalsFilter(dto);
        const count = await JournalModel.count(filter);
        const journals: Journal[] = await JournalModel.find(filter)
                .sort({[dto.sort]: (dto.order === 'asc')? 1 : -1})
                .skip(skip)
                .limit(dto.limit);
        return {
            count: count,
            items: journals,
            ...(dto.page !== undefined) && {page: dto.page},
            ...(dto.limit !== undefined) && {limit: dto.limit},
        };
    },

    createJournal: async (dto: CreateJournalDTO): Promise<Journal> =>
         new JournalModel({
            name: dto.name,
            author: dto.author,
            dateCreated: now(),
            lastUpdated: now(),
        }).save(),

    updateJournal: async (dto: UpdateJournalDTO): Promise<Journal> =>
        JournalModel.findByIdAndUpdate(
            dto.id,
            {
                ...dto.name && {name: dto.name},
                lastUpdated: now()
            },
            {new: true}
        ),

    deleteJournal: async (dto: DeleteJournalDTO): Promise<Journal> => {
        await deleteJournalEntries(dto.id);
        return JournalModel.findByIdAndDelete(dto.id);
    },

    deleteJournals: async (dto: DeleteJournalsDTO): Promise<string> => {
        const filter = mapToJournalsFilter(dto);
        const result = await JournalModel.deleteMany(filter);
        return `${result.deletedCount} journals deleted.`;
    },

    exists: async (id: string): Promise<boolean> => {
        try {
            const journal: Journal = await JournalModel.findById(id);
            return !!journal;
        } catch (error) {
            return false;
        }
    },

    ownsJournal: async (author: string, id: string): Promise<boolean> => {
        try {
            const journal: Journal = await JournalModel.findById(id);
            return journal.author === author;
        } catch (error) {
            return false;
        }
    },
};

const mapToJournalsFilter = (dto: GetJournalsDTO) => ({
    ... dto.name && {name: dto.name},
    ... dto.nameRegex && {name: {$regex: dto.nameRegex, $options: 'i'}},
    ... dto.author && {author: dto.author},
    ... dto.authorRegex && {author: {$regex: dto.authorRegex, $options: 'i'}},
    ... (dto.startDate && !dto.endDate) && {lastUpdated: {$gt: dto.startDate}},
    ... (!dto.startDate && dto.endDate) && {lastUpdated: {$lt: dto.endDate}},
    ... (dto.startDate && dto.endDate) && {lastUpdated: {$gte: dto.startDate, $lte: dto.endDate}},
});
