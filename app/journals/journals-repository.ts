import {
    CreateJournalRequest,
    DeleteJournalRequest,
    DeleteJournalsRequest, GetJournalRequest, GetJournalsRequest,
    Journal,
    UpdateJournalRequest,
} from "./journals.types";
import {PaginatedResponse} from "../utils/paginated-response";

export type JournalsRepository = {
    getJournal: (dto: GetJournalRequest) => Promise<Journal>,
    getJournals: (dto: GetJournalsRequest) => Promise<PaginatedResponse<Journal>>,
    createJournal: (dto: CreateJournalRequest) => Promise<Journal>,
    deleteJournal: (dto: DeleteJournalRequest) => Promise<Journal>,
    deleteJournals: (dto: DeleteJournalsRequest) => Promise<string>,
    updateJournal: (dto: UpdateJournalRequest) => Promise<Journal>,
    exists: (id: string) => Promise<boolean>,
    ownsJournal: (author: string, id: string) => Promise<boolean>,
};