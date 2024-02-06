import { OrderOption } from '@hals/common';

export type User = {
    _id: string,
    username: string,
    hash: string,
    createdAt: Date,
    updatedAt: Date,
    isAdmin: boolean,
    status: UserStatusOption,
};

export type UserStatusOption = 'active' | 'inactive' | 'suspended';

export type UserSortOption = 'username' | 'id' | 'createdAt' | 'updatedAt';

export type GetUserRequest = { username : string };

export type GetUsersRequest = {
    username? : string,
    usernameRegex? : string,
    isAdmin? : string,
    status? : UserStatusOption,
    sort? : UserSortOption,
    order? : OrderOption,
    startDate? : string,
    endDate? : string,
    page? : number,
    limit? : number,
};

export type RegisterUserRequest = {
    username : string,
    password : string,
};

export type RegisterAdminRequest = {
    username : string,
    password : string,
};

export type UpdateUserRequest = {
    username : string,
    newUsername? : string,
    newPassword? : string,
    newIsAdmin? : string,
    newStatus : string,
};

export type UpdateUsersRequest = {
    usernameRegex? : string,
    isAdmin? : string,
    status? : UserStatusOption,
    startDate? : string,
    endDate? : string,
    newIsAdmin? : string,
    newStatus? : UserStatusOption,
};

export type DeleteUserRequest = { username : string };

export type DeleteUsersRequest = {
    usernameRegex? : string,
    isAdmin? : string,
    status? : UserStatusOption,
    startDate? : string,
    endDate? : string,
};