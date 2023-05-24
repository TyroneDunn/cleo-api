import {JournalEntry} from "./journal-entry.type";
import {Observable} from "rxjs";

export type entry$ = (id: string) => Observable<JournalEntry | undefined>;