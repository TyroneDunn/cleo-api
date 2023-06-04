export type GetUserDTO = {
    id?: string,
    username?: string,
};

export type GetUsersDTO = {
    id?: string,
    idRegex?: string,
    username?: string,
    usernameRegex?: string,
    sort?: 'id' | 'username' | 'dateCreated' | 'lastUpdated',
    order?: 1 | -1,
    startDate?: Date,
    endDate?: Date,
    page?: number,
    limit?: number,
    isAdmin?: boolean,
};

export type RegisterUserDTO = {
    username: string,
    password: string,
};

export type DeleteUserDTO = {
    id: string,
};

export type UpdateUserDTO = {
    id?: string,
    username?: string,
    password?: string,
};
