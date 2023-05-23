import {JournalEntry} from "./journal-entry.type";
import {Observable} from "rxjs";

export interface JournalEntryRepository {
    entry$(id: string): Observable<JournalEntry | undefined>;
    entries$(
        id: string,
        page: number,
        limit: number,
    ): Observable<JournalEntry[]>;
    sortEntriesByLastUpdated$(
        id: string,
        order: 1 | -1,
        page: number,
        limit: number,
    ): Observable<JournalEntry[]>;
    sortEntriesByDateCreated$(
        id: string,
        order: 1 | -1,
        page: number,
        limit: number,
    ): Observable<JournalEntry[]>;
    createEntry$(
        id: string,
        body: string,
    ): Observable<JournalEntry>;
    deleteEntry$(
        id: string,
        ): Observable<JournalEntry>;
    updateEntry$(
        id: string,
        content: string,
    ): Observable<JournalEntry>;
}