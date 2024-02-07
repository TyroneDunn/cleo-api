import {
    GetUserRequest,
    GetUsersRequest,
    UpdateUserRequest,
    UpdateUsersRequest,
    DeleteUserRequest,
    DeleteUsersRequest,
} from "./users.types";
import { CommandResult, Error, User } from '@hals/common';
import { GetRecordsResponse } from '../shared/get-records-response.type';

export type UsersRepository = {
    getUser: GetUser,
    getUsers: GetUsers,
    deleteUser: DeleteUser,
    deleteUsers: DeleteUsers,
    updateUser: UpdateUser,
    updateUsers: UpdateUsers,
    exists: UserExists,
};

export type GetUser = (request : GetUserRequest) => Promise<User | Error>;
export type GetUsers = (request : GetUsersRequest) => Promise<GetRecordsResponse<User> | Error>;
export type UpdateUser = (request : UpdateUserRequest) => Promise<User | Error>;
export type UpdateUsers = (request : UpdateUsersRequest) => Promise<CommandResult | Error>;
export type DeleteUser = (request : DeleteUserRequest) => Promise<CommandResult | Error>;
export type DeleteUsers = (request : DeleteUsersRequest) => Promise<CommandResult | Error>;
export type UserExists = (username : string) => Promise<boolean | Error>;
