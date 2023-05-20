import {JournalEntry} from "./journal-entry.type";
import {Observable} from "rxjs";

export interface JournalEntryRepository {
    entry$(id: string): Observable<JournalEntry>;
    entries$(journalId: string): Observable<JournalEntry[]>;
    createEntry$(journalId: string, body: string): Observable<JournalEntry>;
    deleteEntry$(journalId: string, entryId: string): Observable<void>;
    updateEntry$(id: string, content: string): Observable<JournalEntry>;
    journalEntryExists$(id: string): Observable<boolean>;
    getEntry(id: string): Promise<JournalEntry>;
    getEntries(journalId: string): Promise<JournalEntry[]>;
    createEntry(journalId: string, body: string): Promise<JournalEntry>;
    deleteEntry(journalId: string, entryId: string): Promise<void>;
    updateEntry(id: string, content: string): Promise<JournalEntry>;
    journalEntryExists(id: string): Promise<boolean>;
}