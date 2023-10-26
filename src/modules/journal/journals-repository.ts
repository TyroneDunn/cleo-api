import {Journal} from "./journal";
import {
    CreateJournalDTO,
    DeleteJournalDTO,
    DeleteJournalsDTO,
    GetJournalDTO,
    GetJournalsDTO,
    GetJournalsResponseDTO,
    UpdateJournalDTO
} from "./journals-dtos";

export type JournalsRepository = {
    getJournal: (dto: GetJournalDTO) => Promise<Journal>,
    getJournals: (dto: GetJournalsDTO) => Promise<GetJournalsResponseDTO>,
    createJournal: (dto: CreateJournalDTO) => Promise<Journal>,
    deleteJournal: (dto: DeleteJournalDTO) => Promise<Journal>,
    deleteJournals: (dto: DeleteJournalsDTO) => Promise<string>,
    updateJournal: (dto: UpdateJournalDTO) => Promise<Journal>,
    exists: (id: string) => Promise<boolean>,
    ownsJournal: (author: string, id: string) => Promise<boolean>,
};