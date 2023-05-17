import {Journal} from "./journal.type";
import {Observable} from "rxjs";

export interface JournalRepository {
    getJournals(userId: string): Promise<Journal[]>;
    journal$(id: string): Observable<Journal | undefined>;
    createJournal(userId: string, name: string): Promise<Journal>;
    deleteJournal(id: string): Promise<void>;
    updateJournal(id: string, name: string): Promise<Journal>;
    journalExists(id: string): Promise<boolean>;
}