import {Entry} from "./entry";
import {
    GetEntryDTO,
    GetEntriesDTO,
    GetEntriesResponseDTO,
    CreateEntryDTO,
    UpdateEntryDTO,
    DeleteEntryDTO,
    DeleteEntriesDTO,
} from "./entries-dtos";

export type EntriesRepository = {
    getEntry: (dto: GetEntryDTO) => Promise<Entry>,
    getEntries: (dto: GetEntriesDTO) => Promise<GetEntriesResponseDTO>,
    createEntry: (dto: CreateEntryDTO) => Promise<Entry>,
    updateEntry: (dto: UpdateEntryDTO) => Promise<Entry>,
    deleteEntry: (dto: DeleteEntryDTO) => Promise<Entry>,
    deleteEntries: (dto: DeleteEntriesDTO) => Promise<string>,
    exists: (id: string) => Promise<boolean>,
    ownsEntry: (author: string, id: string) => Promise<boolean>,
};
