import {User} from "./user";
import {
    DeleteUserDTO,
    GetUserDTO,
    GetUsersDTO,
    RegisterUserDTO,
    UpdateUserDTO
} from "./users-dtos";

export type UsersRepository = {
    getUser: (dto: GetUserDTO) => Promise<User>,
    getUsers: (dto: GetUsersDTO) => Promise<User[]>,
    registerUser: (dto: RegisterUserDTO) => Promise<User>,
    registerAdminUser: (dto: RegisterUserDTO) => Promise<User>,
    deleteUser: (dto: DeleteUserDTO) => Promise<User>,
    updateUser: (dto: UpdateUserDTO) => Promise<User>,
    exists: (id: string) => Promise<boolean>,
    isAdmin: (id: string) => Promise<boolean>,
};