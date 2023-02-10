import { Journal } from "../journal/journal";
import {JournalEntry} from "../journal/journal-entry";

export interface JournalRepository {
    getJournals(): Promise<Journal[]>;
    getJournal(id: string): Promise<Journal[]>;
    createJournal(name: string): Promise<void>;
    deleteJournal(id: string): Promise<void>;
    getEntry(id: string): Promise<JournalEntry[]>;
    createEntry(journalID: string, body: string): Promise<void>;
}