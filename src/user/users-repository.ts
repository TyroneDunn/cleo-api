import {User} from "./user.type";

export type QueryArgs = {
    id?: string,
    username?: string,
    hash?: string,
};

export type UsersRepository = {
    getUser: (args: QueryArgs) => Promise<User>,
    getUsers: (args: QueryArgs) => Promise<User[]>,
    registerUser: (args: QueryArgs) => Promise<User>,
    deleteUser: (args: QueryArgs) => Promise<User>,
    updateUser: (args: QueryArgs) => Promise<User>,
    exists: (args: QueryArgs) => Promise<boolean>,
};