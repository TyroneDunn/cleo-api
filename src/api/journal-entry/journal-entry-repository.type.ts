import {JournalEntry} from "./journal-entry.type";

export interface JournalEntryRepository {
    getEntry(id: string): Promise<JournalEntry>;
    getEntries(journalId: string): Promise<JournalEntry[]>;
    createEntry(journalId: string, body: string): Promise<JournalEntry>;
    deleteEntry(journalId: string, entryId: string): Promise<void>;
    updateEntry(id: string, content: string): Promise<JournalEntry>;
    journalEntryExists(id: string): Promise<boolean>;
}