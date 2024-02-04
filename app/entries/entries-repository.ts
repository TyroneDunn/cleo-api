import {
    CreateEntryDTO,
    DeleteEntriesDTO,
    DeleteEntryDTO,
    Entry, GetEntriesDTO, GetEntryDTO,
    UpdateEntryDTO,
} from "./entries.types";
import {PaginatedResponse} from "../../utils/paginated-response";

export type EntriesRepository = {
    getEntry: (dto: GetEntryDTO) => Promise<Entry>,
    getEntries: (dto: GetEntriesDTO) => Promise<PaginatedResponse<Entry>>,
    createEntry: (dto: CreateEntryDTO) => Promise<Entry>,
    updateEntry: (dto: UpdateEntryDTO) => Promise<Entry>,
    deleteEntry: (dto: DeleteEntryDTO) => Promise<Entry>,
    deleteEntries: (dto: DeleteEntriesDTO) => Promise<string>,
    exists: (id: string) => Promise<boolean>,
    ownsEntry: (author: string, id: string) => Promise<boolean>,
};
