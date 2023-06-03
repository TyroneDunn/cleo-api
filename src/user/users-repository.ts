import {User} from "./user.type";

export type QueryArgs = {
    id?: string,
    idRegex?: string,
    username?: string,
    usernameRegex?: string,
    hash?: string,
    hashRegex?: string,
    isAdmin?: boolean,
};

export type SortArgs = {
    sort?: 'id' | 'username' | 'dateCreated' | 'lastUpdated' | 'isAdmin',
    order?: 1 | -1,
};

export type FilterArgs = {
    startDate?: Date,
    endDate?: Date,
};

export type PaginationArgs = {
    page?: number,
    limit?: number,
};

export type UsersRepository = {
    getUser: (args: QueryArgs) => Promise<User>,
    getUsers: (
        queryArgs: QueryArgs,
        sortArgs: SortArgs,
        filterArgs: FilterArgs,
        paginationArgs: PaginationArgs
    ) => Promise<User[]>,
    registerUser: (args: QueryArgs) => Promise<User>,
    deleteUser: (args: QueryArgs) => Promise<User>,
    updateUser: (args: QueryArgs) => Promise<User>,
    exists: (args: QueryArgs) => Promise<boolean>,
    isAdmin: (args: QueryArgs) => Promise<boolean>,
};