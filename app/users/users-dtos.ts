import {UserSortOption, UserStatusOption} from "./users.types";
import {OrderOption} from "../../utils/order-option";

export type GetUserDTO = {username: string};

export type GetUsersDTO = {
    username?: string,
    usernameRegex?: string,
    isAdmin?: string,
    status?: UserStatusOption,
    sort?: UserSortOption,
    order?: OrderOption,
    startDate?: string,
    endDate?: string,
    page?: number,
    limit?: number,
};

export type RegisterUserDTO = {
    username: string,
    password: string,
};

export type RegisterAdminDTO = {
    username: string,
    password: string,
};

export type UpdateUserDTO = {
    username: string,
    newUsername?: string,
    newPassword?: string,
    newIsAdmin?: string,
    newStatus: string,
};

export type UpdateUsersDTO = {
    usernameRegex?: string,
    isAdmin?: string,
    status?: UserStatusOption,
    startDate?: string,
    endDate?: string,
    newIsAdmin?: string,
    newStatus?: UserStatusOption,
};

export type DeleteUserDTO = {username: string};

export type DeleteUsersDTO = {
    usernameRegex?: string,
    isAdmin?: string,
    status?: UserStatusOption,
    startDate?: string,
    endDate?: string,
};
