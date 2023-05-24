import {User} from "./user.type";
import {Observable} from "rxjs";

export const registerUser$ = (username: string, password: string) => Observable<User>;
export const userExists$ = (username: string) => Observable<boolean>;