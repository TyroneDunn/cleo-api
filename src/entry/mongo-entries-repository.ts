import {EntriesRepository} from "./entries-repository";
import {Entry} from "./entry";
import EntryModel from "./mongo-entry-model";
import JournalModel from "../journal/mongo-journal-model";
import {Journal} from "../journal/journal";
import {now} from "mongoose";
import {
    GetEntryDTO,
    GetEntriesDTO,
    GetEntriesResponseDTO,
    CreateEntryDTO,
    UpdateEntryDTO,
    DeleteEntryDTO,
    DeleteEntriesDTO
} from "./entries-dtos";

export const MongoEntriesRepository: EntriesRepository = {
    getEntry: async (dto: GetEntryDTO): Promise<Entry> =>
        EntryModel.findById(dto.id),

    getEntries: async (dto: GetEntriesDTO): Promise<GetEntriesResponseDTO> => {
        const skip = (dto.page) * dto.limit;
        const filter = mapToGetEntriesFilter(dto);
        return {
            count: await EntryModel.count(filter),
            entries: await EntryModel.find(filter)
                .sort({[dto.sort]: dto.order})
                .skip(skip)
                .limit(dto.limit),
            ...(dto.page !== undefined) && {page: dto.page},
            ...(dto.limit !== undefined) && {limit: dto.limit},
        };
    },

    createEntry: (dto: CreateEntryDTO): Promise<Entry> =>
        new EntryModel({
            body: dto.body,
            journal: dto.journal,
            dateCreated: now(),
            lastUpdated: now(),
        }).save(),

    updateEntry: async (dto: UpdateEntryDTO): Promise<Entry> =>
        EntryModel.findByIdAndUpdate(
            dto.id,
            {
                ... dto.body && {body: dto.body},
                ... dto.journal && {journal: dto.journal},
                lastUpdated: now()
            },
            {new: true}
        ),

    deleteEntry: async (dto: DeleteEntryDTO): Promise<Entry> =>
        EntryModel.findByIdAndDelete(dto.id),

    deleteEntries: async (dto: DeleteEntriesDTO): Promise<string> => {
        const filter = mapToDeleteEntriesFilter(dto);
        const result = await EntryModel.deleteMany(filter);
        return `${result.deletedCount} entries deleted.`;
    },

    exists: async (id: string): Promise<boolean> => {
        try {
            const entry: Entry = await EntryModel.findById(id);
            return !!entry;
        } catch (error) {
            return false;
        }
    },

    ownsEntry: async (author: string, id: string): Promise<boolean> => {
        try {
            const entry: Entry = await EntryModel.findById(id);
            const journal: Journal = await JournalModel.findById(entry.journal);
            return journal.author.toString() === author;
        } catch (error) {
            return false;
        }
    },
};

const mapToGetEntriesFilter = (dto: GetEntriesDTO) => ({
    ... dto.journal && {journal: dto.journal},
    ... dto.body && {body: dto.body},
    ... dto.bodyRegex && {body: {$regex: dto.bodyRegex, $options: 'i'}},
    ... (dto.startDate && !dto.endDate) && {dateCreated: {$gt: dto.startDate}},
    ... (!dto.startDate && dto.endDate) && {dateCreated: {$lt: dto.endDate}},
    ... (dto.startDate && dto.endDate) && {dateCreated: {$gte: dto.startDate, $lte: dto.endDate}},
});

const mapToDeleteEntriesFilter = (dto: DeleteEntriesDTO) => ({
    ... dto.journal && {journal: dto.journal},
    ... dto.body && {body: dto.body},
    ... dto.bodyRegex && {body: {$regex: dto.bodyRegex, $options: 'i'}},
    ... (dto.startDate && !dto.endDate) && {dateCreated: {$gt: dto.startDate}},
    ... (!dto.startDate && dto.endDate) && {dateCreated: {$lt: dto.endDate}},
    ... (dto.startDate && dto.endDate) && {dateCreated: {$gte: dto.startDate, $lte: dto.endDate}},
});
