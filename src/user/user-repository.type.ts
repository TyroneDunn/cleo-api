import {User} from "./user.type";
import {Observable} from "rxjs";

export interface UserRepository {
    registerUser$(username: string, password: string): Observable<User>;
    userExists$(username: string): Observable<boolean>;
}