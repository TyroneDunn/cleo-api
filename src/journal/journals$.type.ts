import {Observable} from "rxjs";
import {Journal} from "./journal.type";

export type Journals$ =
    (id: string, page: number, limit: number) => Observable<Journal[]>;