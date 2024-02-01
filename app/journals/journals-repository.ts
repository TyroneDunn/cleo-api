import {Journal} from "./journals.types";
import {
    CreateJournalDTO,
    DeleteJournalDTO,
    DeleteJournalsDTO,
    GetJournalDTO,
    GetJournalsDTO,
    UpdateJournalDTO
} from "./journals-dtos";
import {PaginatedResponse} from "../utils/paginated-response";

export type JournalsRepository = {
    getJournal: (dto: GetJournalDTO) => Promise<Journal>,
    getJournals: (dto: GetJournalsDTO) => Promise<PaginatedResponse<Journal>>,
    createJournal: (dto: CreateJournalDTO) => Promise<Journal>,
    deleteJournal: (dto: DeleteJournalDTO) => Promise<Journal>,
    deleteJournals: (dto: DeleteJournalsDTO) => Promise<string>,
    updateJournal: (dto: UpdateJournalDTO) => Promise<Journal>,
    exists: (id: string) => Promise<boolean>,
    ownsJournal: (author: string, id: string) => Promise<boolean>,
};