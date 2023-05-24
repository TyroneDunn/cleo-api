import {JournalEntry} from "./journal-entry.type";
import {Observable} from "rxjs";

export type entry$ = (id: string) => Observable<JournalEntry | undefined>;

export type entries$ = (
    id: string,
    page: number,
    limit: number,
) => Observable<JournalEntry[]>;

export type createEntry$ = (
    id: string,
    body: string,
) => Observable<JournalEntry>;
