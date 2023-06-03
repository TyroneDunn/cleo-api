export type GetUserDTO = {
    senderId: string,
    id: string,
};

export type GetUsersDTO = {
    senderId: string,
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
    senderId: string,
    id: string,
};

export type UpdateUserDTO = {
    senderId: string,
    id: string,
    username?: string,
    password?: string,
};
