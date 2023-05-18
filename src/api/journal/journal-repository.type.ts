import {Journal} from "./journal.type";
import {Observable} from "rxjs";

export interface JournalRepository {
    journal$(id: string): Observable<Journal | Error>;
    journals$(userId: string): Observable<Journal[]>;
    createJournal(userId: string, name: string): Promise<Journal>;
    deleteJournal(id: string): Promise<void>;
    updateJournal(id: string, name: string): Promise<Journal>;
    journalExists(id: string): Promise<boolean>;
}