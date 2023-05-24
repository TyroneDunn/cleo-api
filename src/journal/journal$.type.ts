import {Observable} from "rxjs";
import {Journal} from "./journal.type";

export type journal$ = (id: string) => Observable<Journal | undefined>;