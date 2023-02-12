import { Journal } from "../entities/journal/journal";
import {JournalEntry} from "../entities/journal/journal-entry";

export interface JournalRepository {
    getJournals(): Promise<Journal[]>;
    getJournal(id: string): Promise<Journal[]>;
    createJournal(name: string): Promise<void>;
    deleteJournal(id: string): Promise<void>;
    getEntry(journalid: string, entryID: string): Promise<JournalEntry[]>;
    getEntries(journalID: string): Promise<JournalEntry[]>;
    createEntry(journalID: string, body: string): Promise<void>;
    deleteEntry(journalID: string, entryID: string): Promise<void>;
}