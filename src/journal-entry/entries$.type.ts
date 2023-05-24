import {JournalEntry} from "./journal-entry.type";
import {Observable} from "rxjs";

export type Entry$ = (id: string) => Observable<JournalEntry | undefined>;

export type Entries$ = (
    id: string,
    page: number,
    limit: number,
) => Observable<JournalEntry[]>;

export type CreateEntry$ = (
    id: string,
    body: string,
) => Observable<JournalEntry>;

export type DeleteEntry$ = (
    id: string,
) => Observable<JournalEntry>;

export type SortEntriesByDateCreated$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number,
) => Observable<JournalEntry[]>;

export type SortEntriesByLastUpdated$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number,
) => Observable<JournalEntry[]>;
