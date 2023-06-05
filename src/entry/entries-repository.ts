import {Entry} from "./entry";
import {
    CreateEntryDTO,
    DeleteEntryDTO,
    GetEntriesDTO,
    GetEntryDTO,
    UpdateEntryDTO
} from "./entries-dtos";

export type EntriesRepository = {
    getEntry: (dto: GetEntryDTO) => Promise<Entry>,
    getEntries: (dto: GetEntriesDTO) => Promise<Entry[]>,
    createEntry: (dto: CreateEntryDTO) => Promise<Entry>,
    deleteEntry: (dto: DeleteEntryDTO) => Promise<Entry>,
    updateEntry: (dto: UpdateEntryDTO) => Promise<Entry>,
    exists: (id: string) => Promise<boolean>,
    ownsEntry: (author: string, id: string) => Promise<boolean>,
};
