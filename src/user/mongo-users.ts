import {User} from "./user.type";
import UserModel from "./mongo-user-model";
import {RegisterUser$, UserExists$} from "./users.type";
import {generateHash} from "../utils/password-utils";
import {Observable} from "rxjs";

export const registerUser$: RegisterUser$ =
    (username: string, password: string): Observable<User> => {
        return new Observable((subscriber) => {
            new UserModel({
                username: username,
                hash: generateHash(password),
            }).save((error, user: User) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }
                subscriber.next(user);
                subscriber.complete();
            });
        });
    };

export const userExists$: UserExists$ =
    (username: string): Observable<boolean> => {
        return new Observable((subscriber) => {
            UserModel.findOne({username: username}, (error, user) => {
                if (error) {
                    subscriber.error(error);
                    subscriber.complete();
                    return;
                }

                if (!user) {
                    subscriber.next(false);
                    subscriber.complete();
                }
                else {
                    subscriber.next(true);
                    subscriber.complete();
                }
            });
        });
    };