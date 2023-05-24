import {generateHash} from "../utils/password-utils";
import UserModel from "./user-model";
import {Observable} from "rxjs";
import {User} from "./user.type";
import {RegisterUser$, UserExists$} from "./users.type";

export const registerUser$: RegisterUser$ = (username: string, password: string) => {
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

export const userExists$: UserExists$ = (username: string) => {
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