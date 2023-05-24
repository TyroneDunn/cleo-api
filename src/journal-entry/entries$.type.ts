import {JournalEntry} from "./journal-entry.type";
import {Observable} from "rxjs";

export type entries$ = (
    id: string,
    page: number,
    limit: number,
) => Observable<JournalEntry[]>;