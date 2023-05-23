import {JournalEntry} from "./journal-entry.type";
import {Observable} from "rxjs";

export interface JournalEntryRepository {
    entry$(id: string): Observable<JournalEntry | undefined>;
    entries$(
        journalId: string,
        page: number,
        limit: number,
    ): Observable<JournalEntry[]>;
    createEntry$(
        journalId: string,
        body: string,
        page: number,
        limit: number,
    ): Observable<JournalEntry>;
    deleteEntry$(
        id: string,
        page: number,
        limit: number,
        ): Observable<JournalEntry>;
    updateEntry$(
        id: string,
        content: string,
        page: number,
        limit: number,
    ): Observable<JournalEntry>;
}