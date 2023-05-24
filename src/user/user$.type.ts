import {User} from "./user.type";
import {Observable} from "rxjs";

export const RegisterUser$ = (username: string, password: string) => Observable<User>;
export const UserExists$ = (username: string) => Observable<boolean>;