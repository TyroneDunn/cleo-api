import {User} from "./user.type";

export type QueryArgs = {
    id?: string,
    username?: string,
    hash?: string,
};

export type UsersRepository = {
    registerUser: (args: QueryArgs) => Promise<User>,
    exists: (args: QueryArgs) => Promise<boolean>,
};