import {Journal} from "./journal.type";
import {Observable} from "rxjs";

export interface JournalRepository {
    journal$(id: string): Observable<Journal | undefined>;
    journals$(userId: string): Observable<Journal[]>;
    createJournal$(userId: string, name: string): Observable<Journal>;
    deleteJournal$(id: string): Observable<Journal>;
    updateJournal$(id: string, name: string): Observable<Journal>;
}