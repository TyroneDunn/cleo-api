import {Observable} from "rxjs";

export interface UserRepository {
    registerUser$(username: string, password: string): Observable<void>;
    userExists$(username: string): Observable<Boolean>;
    registerUser(username: string, password: string): Promise<void>;
    userExists(username: string): Promise<Boolean>;
}