import { Journal } from "../journal/journal";

export interface JournalRepository {
    getJournals(): Promise<Journal[]>;
    createJournal(name: string): Promise<void>;
}