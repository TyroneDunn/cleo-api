export type GetUserDTO = {
    userId: string,
    id: string,
};

export type GetUsersDTO = {
    userId: string,
    id?: string,
    idRegex?: string,
    username?: string,
    usernameRegex: string,
    sort?: 'id' | 'username' | 'dateCreated' | 'lastUpdated',
    order?: 1 | -1,
    startDate?: Date,
    endDate?: Date,
    page?: number,
    limit?: number,
};

export type RegisterUserDTO = {
    username: string,
    password: string,
};

export type DeleteUserDTO = {
    userId: string,
    id: string,
};

export type UpdateUserDTO = {
    userId: string,
    username?: string,
    password?: string,
};
