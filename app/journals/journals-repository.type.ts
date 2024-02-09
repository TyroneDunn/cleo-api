import {
    Journal,
    GetJournalRequest,
    GetJournalsRequest,
    CreateJournalRequest,
    UpdateJournalRequest,
    DeleteJournalRequest,
    DeleteJournalsRequest,
} from "./journals.types";
import { CommandResult, Error } from "@hals/common";
import { GetRecordsResponse } from '../shared/get-records-response.type';

export type JournalsRepository = {
    getJournal: GetJournal,
    getJournals: GetJournals,
    createJournal: CreateJournal,
    updateJournal: UpdateJournal,
    deleteJournal: DeleteJournal,
    deleteJournals: DeleteJournals,
    exists: JournalExists,
    ownsJournal: OwnsJournal,
};

export type GetJournal = (request : GetJournalRequest) => Promise<Journal | Error>;
export type GetJournals = (request : GetJournalsRequest) => Promise<GetRecordsResponse<Journal> | Error>;
export type CreateJournal = (request : CreateJournalRequest) => Promise<Journal | Error>;
export type UpdateJournal = (request : UpdateJournalRequest) => Promise<Journal | Error>;
export type DeleteJournal = (request : DeleteJournalRequest) => Promise<CommandResult | Error>;
export type DeleteJournals = (request : DeleteJournalsRequest) => Promise<CommandResult | Error>;
export type JournalExists = (id : string) => Promise<boolean | Error>;
export type OwnsJournal = (author : string, id : string) => Promise<boolean | Error>;
