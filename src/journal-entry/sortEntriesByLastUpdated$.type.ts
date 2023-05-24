import { Observable } from "rxjs";
import {JournalEntry} from "./journal-entry.type";

export type sortEntriesByLastUpdated$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number,
) => Observable<JournalEntry[]>;