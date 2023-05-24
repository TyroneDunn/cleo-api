import {JournalEntry} from "./journal-entry.type";
import {Observable} from "rxjs";

export type createEntry$ = (
    id: string,
    body: string,
) => Observable<JournalEntry>;
