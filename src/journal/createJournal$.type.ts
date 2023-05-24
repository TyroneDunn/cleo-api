import {Observable} from "rxjs";
import {Journal} from "./journal.type";

export type CreateJournal$ = (userId: string, name: string) => Observable<Journal>;