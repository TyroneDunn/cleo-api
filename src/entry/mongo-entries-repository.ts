import {EntriesRepository} from "./entries-repository";
import {Entry} from "./entry";
import EntryModel from "./mongo-entry-model";
import JournalModel from "../journal/mongo-journal-model";
import {Journal} from "../journal/journal";
import {now} from "mongoose";
import {
    CreateEntryDTO,
    DeleteEntryDTO,
    GetEntriesDTO,
    GetEntryDTO,
    UpdateEntryDTO
} from "./entries-dtos";

const mapToGetEntriesOptions = (dto: GetEntriesDTO) => ({
        ... dto.idRegex && {_id: {$regex: dto.idRegex, $options: 'i'}},
        ... dto.journal && {journal: dto.journal},
        ... dto.journalRegex && {journal: {$regex: dto.journal, $options: 'i'}},
        ... dto.body && {body: dto.body},
        ... dto.bodyRegex && {body: {$regex: dto.bodyRegex, $options: 'i'}},
        ... (dto.startDate && !dto.endDate) && {dateCreated: {$gt: dto.startDate}},
        ... (!dto.startDate && dto.endDate) && {dateCreated: {$lt: dto.endDate}},
        ... (dto.startDate && dto.endDate) && {dateCreated: {$gte: dto.startDate, $lte: dto.endDate}},
});

export const MongoEntriesRepository: EntriesRepository = {
    getEntry: async (dto: GetEntryDTO): Promise<Entry> =>
        EntryModel.findById(dto.id),

    getEntries: async (dto: GetEntriesDTO): Promise<Entry[]> => {
        const skip = (dto.page - 1) * dto.limit;
        const options = mapToGetEntriesOptions(dto);
        return EntryModel.find(options)
            .sort({[dto.sort]: dto.order})
            .skip(skip)
            .limit(dto.limit);
    },

    createEntry: (dto: CreateEntryDTO): Promise<Entry> =>
        new EntryModel({
            body: dto.body,
            journal: dto.journal,
            dateCreated: now(),
            lastUpdated: now(),
        }).save(),

    deleteEntry: async (dto: DeleteEntryDTO): Promise<Entry> =>
        EntryModel.findByIdAndDelete(dto.id),

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