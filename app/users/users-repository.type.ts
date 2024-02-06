import {User} from "./users.types";
import {
    DeleteUserRequest,
    DeleteUsersRequest,
    GetUserRequest,
    GetUsersRequest,
    RegisterUserRequest,
    UpdateUserRequest,
    UpdateUsersRequest
} from "./users-dtos";

export type UsersRepository = {
    getUser: (dto: GetUserRequest) => Promise<User>,
    getUsers: (dto: GetUsersRequest) => Promise<User[]>,
    registerUser: (dto: RegisterUserRequest) => Promise<User>,
    registerAdminUser: (dto: RegisterUserRequest) => Promise<User>,
    deleteUser: (dto: DeleteUserRequest) => Promise<User>,
    deleteUsers: (dto: DeleteUsersRequest) => Promise<string>,
    updateUser: (dto: UpdateUserRequest) => Promise<User>,
    updateUsers: (dto: UpdateUsersRequest) => Promise<User[]>,
    exists: (username: string) => Promise<boolean>,
    isAdmin: (username: string) => Promise<boolean>,
};