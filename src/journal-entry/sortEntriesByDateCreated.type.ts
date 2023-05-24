import {JournalEntry} from "./journal-entry.type";
import { Observable } from "rxjs";

export type sortEntriesByDateCreated$ = (
    id: string,
    order: 1 | -1,
    page: number,
    limit: number,
) => Observable<JournalEntry[]>;
