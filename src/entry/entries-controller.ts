import {Entry} from "./entry.type";
import {EntriesRepository} from "./entries-repository";
import {ENTRIES_REPOSITORY} from "../config";
import {
    CreateEntryDTO,
    DeleteEntryDTO,
    GetEntriesDTO,
    GetEntryDTO,
    UpdateEntryDTO
} from "./entry-dtos";
const repository: EntriesRepository = ENTRIES_REPOSITORY;

export const EntriesController = {
    getEntry: async (dto: GetEntryDTO): Promise<Entry> => {},
    getEntries: async (dto: GetEntriesDTO): Promise<Entry> => {},
    createEntry: async (dto: CreateEntryDTO): Promise<Entry> => {},
    deleteEntry: async (dto: DeleteEntryDTO): Promise<Entry> => {},
    updateEntry: async (dto: UpdateEntryDTO): Promise<Entry> => {},
};
