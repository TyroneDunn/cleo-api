import { Observable } from "rxjs";
import {Journal} from "../journal/journal.type";

export const deleteJournal$ = (id: string) => Observable<Journal>;