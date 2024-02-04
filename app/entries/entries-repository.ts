import {
    CreateEntryRequest,
    DeleteEntriesRequest,
    DeleteEntryRequest,
    Entry, GetEntriesRequest, GetEntryRequest,
    UpdateEntryRequest,
} from "./entries.types";
import {PaginatedResponse} from "../../utils/paginated-response";

export type EntriesRepository = {
    getEntry: (dto: GetEntryRequest) => Promise<Entry>,
    getEntries: (dto: GetEntriesRequest) => Promise<PaginatedResponse<Entry>>,
    createEntry: (dto: CreateEntryRequest) => Promise<Entry>,
    updateEntry: (dto: UpdateEntryRequest) => Promise<Entry>,
    deleteEntry: (dto: DeleteEntryRequest) => Promise<Entry>,
    deleteEntries: (dto: DeleteEntriesRequest) => Promise<string>,
    exists: (id: string) => Promise<boolean>,
    ownsEntry: (author: string, id: string) => Promise<boolean>,
};
