import { Observable } from "rxjs";
import {Journal} from "../journal/journal.type";

export type DeleteJournal$ = (id: string) => Observable<Journal>;