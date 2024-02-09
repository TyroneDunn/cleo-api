import {
    Entry,
    CreateEntryRequest,
    DeleteEntriesRequest,
    DeleteEntryRequest,
    GetEntriesRequest,
    GetEntryRequest,
    UpdateEntryRequest,
} from "./entries.types";
import { GetRecordsResponse } from '../shared/get-records-response.type';
import { CommandResult, Error } from '@hals/common';

export type EntriesRepository = {
    getEntry: GetEntry,
    getEntries: GetEntries,
    createEntry: CreateEntry,
    updateEntry: UpdateEntry,
    deleteEntry: DeleteEntry,
    deleteEntries: DeleteEntries,
    exists: EntryExists,
    ownsEntry: OwnsEntry,
};

export type GetEntry = (request : GetEntryRequest) => Promise<Entry | Error>;
export type GetEntries = (request : GetEntriesRequest) => Promise<GetRecordsResponse<Entry> | Error>;
export type CreateEntry = (request : CreateEntryRequest) => Promise<Entry | Error>;
export type UpdateEntry = (request : UpdateEntryRequest) => Promise<Entry | Error>;
export type DeleteEntry = (request : DeleteEntryRequest) => Promise<CommandResult | Error>;
export type DeleteEntries = (request : DeleteEntriesRequest) => Promise<CommandResult | Error>;
export type EntryExists = (id : string) => Promise<boolean | Error>;
export type OwnsEntry = (author : string, id : string) => Promise<boolean | Error>;
