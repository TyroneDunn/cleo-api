import {EntriesRepository} from "./entries-repository";
import {Entry} from "./entry";
import EntryModel from "./mongo-entry-model";
import JournalModel from "../journal/mongo-journal-model";
import {Journal} from "../journal/journal";
import {now} from "mongoose";
import {
    GetEntryDTO,
    GetEntriesDTO,
    CreateEntryDTO,
    UpdateEntryDTO,
    DeleteEntryDTO,
    DeleteEntriesDTO
} from "./entries-dtos";
import {JOURNALS_REPOSITORY} from "../../repositories-config";
import {PaginatedResponse} from "../../utils/paginated-response";

export const MongoEntriesRepository: EntriesRepository = {
    getEntry: async (dto: GetEntryDTO): Promise<Entry> =>
        EntryModel.findById(dto.id),

    getEntries: async (dto: GetEntriesDTO): Promise<PaginatedResponse<Entry>> => {
        const skip = (dto.page) * dto.limit;
        const filter = mapToGetEntriesFilter(dto);
        const entries: Entry[] = await EntryModel.find(filter)
            .sort({[dto.sort]: dto.order})
            .skip(skip)
            .limit(dto.limit);
        return {
            count: entries.length,
            items: entries,
            ...(dto.page !== undefined) && {page: dto.page},
            ...(dto.limit !== undefined) && {limit: dto.limit},
        };
    },

    createEntry: async (dto: CreateEntryDTO): Promise<Entry> => {
        const entry: Entry = await new EntryModel({
            body: dto.body,
            journal: dto.journal,
            dateCreated: now(),
            lastUpdated: now(),
        }).save();
        await JOURNALS_REPOSITORY.updateJournal({id: dto.journal});
        return entry;
    },

    updateEntry: async (dto: UpdateEntryDTO): Promise<Entry> => {
        const entry: Entry = await EntryModel.findByIdAndUpdate(
            dto.id,
            {
                ... dto.body && {body: dto.body},
                ... dto.journal && {journal: dto.journal},
                lastUpdated: now()
            },
            {new: true}
        );
        await JOURNALS_REPOSITORY.updateJournal({id: entry.journal.toString()});
        return entry;
    },

    deleteEntry: async (dto: DeleteEntryDTO): Promise<Entry> => {
        const entry: Entry = await EntryModel.findByIdAndDelete(dto.id);
        await JOURNALS_REPOSITORY.updateJournal({id: entry.journal.toString()});
        return entry;
    },

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
    ... (dto.startDate && !dto.endDate) && {lastUpdated: {$gt: dto.startDate}},
    ... (!dto.startDate && dto.endDate) && {lastUpdated: {$lt: dto.endDate}},
    ... (dto.startDate && dto.endDate) && {lastUpdated: {$gte: dto.startDate, $lte: dto.endDate}},
});

const mapToDeleteEntriesFilter = (dto: DeleteEntriesDTO) => ({
    ... dto.journal && {journal: dto.journal},
    ... dto.body && {body: dto.body},
    ... dto.bodyRegex && {body: {$regex: dto.bodyRegex, $options: 'i'}},
    ... (dto.startDate && !dto.endDate) && {lastUpdated: {$gt: dto.startDate}},
    ... (!dto.startDate && dto.endDate) && {lastUpdated: {$lt: dto.endDate}},
    ... (dto.startDate && dto.endDate) && {lastUpdated: {$gte: dto.startDate, $lte: dto.endDate}},
});
