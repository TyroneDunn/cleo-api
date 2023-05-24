import {Journal} from "./journal.type";
import {Observable} from "rxjs";

export type Journal$ = (id: string) => Observable<Journal | undefined>;
export type Journals$ = (id: string, page: number, limit: number) => Observable<Journal[]>;
export type CreateJournal$ = (userId: string, name: string) => Observable<Journal>;
export type DeleteJournal$ = (id: string) => Observable<Journal>;
export type UpdateJournal$ = (id: string, name: string) => Observable<Journal>;
export type SortUsersJournals$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number,
) => Observable<Journal[]>;
export type SearchUsersJournals$ = (
    id: string,
    query: string,
    page: number,
    limit: number
) => Observable<Journal[]>;
