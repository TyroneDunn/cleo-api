import {EntriesRepository} from "./entries-repository";
import {Entry} from "./entries.types";
import EntryModel from "./mongo-entry-model";
import JournalModel from "../journals/mongo-journal-model.type";
import {Journal} from "../journals/journals.types";
import {now} from "mongoose";
import {
    GetEntryDTO,
    GetEntriesDTO,
    CreateEntryDTO,
    UpdateEntryDTO,
    DeleteEntryDTO,
    DeleteEntriesDTO
} from "./entries-dtos";
import { JOURNALS_REPOSITORY } from '../repositories-config';
import { PaginatedResponse } from '../utils/paginated-response';

export const MongoEntriesRepository: EntriesRepository = {
    getEntry: async (dto: GetEntryDTO): Promise<Entry> =>
        EntryModel.findById(dto.id),

    getEntries: async (dto: GetEntriesDTO): Promise<PaginatedResponse<Entry>> => {
        const skip = (dto.page) * dto.limit;
        const filter = mapToEntriesFilter(dto);
        const count = await EntryModel.count(filter);
        const entries: Entry[] = await EntryModel.find(filter)
            .sort({[dto.sort]: dto.order === 'asc'? 1: -1})
            .skip(skip)
            .limit(dto.limit);
        return {
            count: count,
            items: entries,
            ...(dto.page !== undefined) && {page: dto.page},
            ...(dto.limit !== undefined) && {limit: dto.limit},
        };
    },

    createEntry: async (dto: CreateEntryDTO): Promise<Entry> => {
        const entry: Entry = await new EntryModel(mapToCreateEntryQuery(dto)).save();
        await JOURNALS_REPOSITORY.updateJournal({id: dto.journal});
        return entry;
    },

    updateEntry: async (dto: UpdateEntryDTO): Promise<Entry> => {
        const entry: Entry = await EntryModel.findByIdAndUpdate(
            dto.id,
            mapToUpdateEntryQuery(dto),
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
        const filter = mapToEntriesFilter(dto);
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

const mapToEntriesFilter = (dto: GetEntriesDTO) => {
    if (dto.titleRegex && dto.bodyRegex) {
        return ({
            "$or": [
                {title: {$regex: dto.titleRegex, $options: 'i'}},
                {body: {$regex: dto.bodyRegex, $options: 'i'}},
            ],
            ...dto.journal && {journal: dto.journal},
            ...dto.title && {title: dto.title},
            ...dto.body && {body: dto.body},
            ...(dto.startDate && !dto.endDate) && {lastUpdated: {$gt: dto.startDate}},
            ...(!dto.startDate && dto.endDate) && {lastUpdated: {$lt: dto.endDate}},
            ...(dto.startDate && dto.endDate) && {
                lastUpdated: {
                    $gte: dto.startDate,
                    $lte: dto.endDate
                }
            },
        })
    } else
        return ({
            ...dto.journal && {journal: dto.journal},
            ...dto.title && {title: dto.title},
            ...dto.titleRegex && {title: {$regex: dto.titleRegex, $options: 'i'}},
            ...dto.body && {body: dto.body},
            ...dto.bodyRegex && {body: {$regex: dto.bodyRegex, $options: 'i'}},
            ...(dto.startDate && !dto.endDate) && {lastUpdated: {$gt: dto.startDate}},
            ...(!dto.startDate && dto.endDate) && {lastUpdated: {$lt: dto.endDate}},
            ...(dto.startDate && dto.endDate) && {
                lastUpdated: {
                    $gte: dto.startDate,
                    $lte: dto.endDate
                }
            },
        });
};

const mapToCreateEntryQuery = (dto: CreateEntryDTO) => ({
    title: dto.title,
    body: dto.body,
    journal: dto.journal,
    dateCreated: now(),
    lastUpdated: now(),
});

const mapToUpdateEntryQuery = (dto: UpdateEntryDTO) => ({
    ... dto.title && {title: dto.title},
    ... dto.body && {body: dto.body},
    ... dto.journal && {journal: dto.journal},
    lastUpdated: now()
});
