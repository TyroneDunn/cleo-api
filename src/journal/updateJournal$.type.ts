import {Observable} from "rxjs";
import {Journal} from "../journal/journal.type";

export type UpdateJournal$ = (id: string, name: string) => Observable<Journal>;