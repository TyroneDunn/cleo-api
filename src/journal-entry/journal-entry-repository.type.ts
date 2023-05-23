import {JournalEntry} from "./journal-entry.type";
import {Observable} from "rxjs";

export interface JournalEntryRepository {
    entry$(id: string): Observable<JournalEntry | undefined>;
    entries$(
        journalId: string,
        page: number,
        limit: number
    ): Observable<JournalEntry[]>;
    createEntry$(journalId: string, body: string): Observable<JournalEntry>;
    deleteEntry$(id: string): Observable<JournalEntry>;
    updateEntry$(id: string, content: string): Observable<JournalEntry>;
}