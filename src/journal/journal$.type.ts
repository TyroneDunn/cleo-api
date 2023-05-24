import {Observable} from "rxjs";
import {Journal} from "./journal.type";

export type Journal$ = (id: string) => Observable<Journal | undefined>;