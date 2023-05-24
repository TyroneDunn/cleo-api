import {Observable} from "rxjs";
import {Journal} from "./journal.type"

export type SortUsersJournals$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number,
) => Observable<Journal[]>;
