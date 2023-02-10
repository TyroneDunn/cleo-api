import { Journal } from "../journal/journal";

export interface JournalRepository {
    getJournals(): Promise<Journal[]>;
    getJournal(id: string): Promise<Journal[]>;
    createJournal(name: string): Promise<void>;
    deleteJournal(id: string): Promise<void>;
}