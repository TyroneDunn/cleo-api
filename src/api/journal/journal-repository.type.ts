import {Journal} from "./journal.type";

export interface JournalRepository {
    getJournals(userId: string): Promise<Journal[]>;
    getJournal(id: string): Promise<Journal | null>;
    createJournal(userId: string, name: string): Promise<Journal>;
    deleteJournal(id: string): Promise<void>;
    updateJournal(id: string, name: string): Promise<Journal>;
    journalExists(id: string): Promise<boolean>;
}