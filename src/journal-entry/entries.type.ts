import {JournalEntry} from "./journal-entry.type";
import {Observable} from "rxjs";

export type Entry$ = (id: string) => Observable<JournalEntry | undefined>;

export type Entries$ = (
    id: string,
    page: number,
    limit: number,
) => Observable<JournalEntry[]>;

export type SearchJournal$ = (
    id: string,
    query: string,
    page: number,
    limit: number,
) => Observable<JournalEntry[]>;

export type SearchJournalAndSortBy$ = (
    id: string,
    query: string,
    order: 1 | -1,
    page: number,
    limit: number,
) => Observable<JournalEntry[]>;

export type SearchEntries$ = (
    id: string,
    query: string,
    page: number,
    limit: number
) => Observable<JournalEntry[]>;

export type SearchEntriesAndSortBy$ = (
    id: string,
    query: string,
    order: 1 | -1,
    page: number,
    limit: number
) => Observable<JournalEntry[]>;

export type CreateEntry$ = (
    id: string,
    body: string,
) => Observable<JournalEntry>;

export type DeleteEntry$ = (
    id: string,
) => Observable<JournalEntry>;

export type UpdateEntry$ = (
    id: string,
    content: string,
) => Observable<JournalEntry>;
export type SortEntriesBy$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number,
) => Observable<JournalEntry[]>;
