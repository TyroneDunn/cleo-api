import {User} from "./user.type";
import {Observable} from "rxjs";

export type RegisterUser$ = (username: string, password: string) => Observable<User>;
export type UserExists$ = (username: string) => Observable<boolean>;