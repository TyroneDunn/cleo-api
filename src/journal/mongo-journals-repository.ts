import {Journal} from "./journal"
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

const deleteJournalEntries = async (journal: string): Promise<void> => {
    await JournalEntryModel.deleteMany({journal: journal});
};

export const MongoJournalsRepository: JournalsRepository = {
    getJournal: async (dto: GetJournalDTO): Promise<Journal> =>
        JournalModel.findById(dto.id),

    getJournals: async (dto: GetJournalsDTO): Promise<Journal[]> => {
        const skip = (dto.page - 1) * dto.limit;
        const filter = mapToGetJournalsFilter(dto);
        return JournalModel.find(filter)
            .sort({[dto.sort]: dto.order})
            .skip(skip)
            .limit(dto.limit);
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
                name: dto.name,
                lastUpdated: now()
            },
            {new: true}
        ),

    deleteJournal: async (dto: DeleteJournalDTO): Promise<Journal> => {
        await deleteJournalEntries(dto.id);
        return JournalModel.findByIdAndDelete(dto.id);
    },

    deleteJournals: async (dto: DeleteJournalsDTO): Promise<string> => {
        const filter = mapToDeleteJournalsFilter(dto);
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
            return journal.author.toString() === author;
        } catch (error) {
            return false;
        }
    },
};

const mapToGetJournalsFilter = (dto: GetJournalsDTO) => ({
    ... dto.name && {name: dto.name},
    ... dto.nameRegex && {name: {$regex: dto.nameRegex, $options: 'i'}},
    ... dto.author && {author: dto.author},
    ... dto.authorRegex && {author: {$regex: dto.authorRegex, $options: 'i'}},
    ... (dto.startDate && !dto.endDate) && {dateCreated: {$gt: dto.startDate}},
    ... (!dto.startDate && dto.endDate) && {dateCreated: {$lt: dto.endDate}},
    ... (dto.startDate && dto.endDate) && {dateCreated: {$gte: dto.startDate, $lte: dto.endDate}},
});

const mapToDeleteJournalsFilter = (dto: DeleteJournalsDTO) => ({
    ... dto.name && {name: dto.name},
    ... dto.nameRegex && {name: {$regex: dto.nameRegex, $options: 'i'}},
    ... dto.author && {author: dto.author},
    ... dto.authorRegex && {author: {$regex: dto.authorRegex, $options: 'i'}},
    ... (dto.startDate && !dto.endDate) && {dateCreated: {$gt: dto.startDate}},
    ... (!dto.startDate && dto.endDate) && {dateCreated: {$lt: dto.endDate}},
    ... (dto.startDate && dto.endDate) && {dateCreated: {$gte: dto.startDate, $lte: dto.endDate}},
});

