import {UserSortOption, UserStatusOption} from "./users.types";
import {OrderOption} from "../../utils/order-option";

export type GetUserRequest = {username: string};

export type GetUsersRequest = {
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

export type RegisterUserRequest = {
    username: string,
    password: string,
};

export type RegisterAdminRequest = {
    username: string,
    password: string,
};

export type UpdateUserRequest = {
    username: string,
    newUsername?: string,
    newPassword?: string,
    newIsAdmin?: string,
    newStatus: string,
};

export type UpdateUsersRequest = {
    usernameRegex?: string,
    isAdmin?: string,
    status?: UserStatusOption,
    startDate?: string,
    endDate?: string,
    newIsAdmin?: string,
    newStatus?: UserStatusOption,
};

export type DeleteUserRequest = {username: string};

export type DeleteUsersRequest = {
    usernameRegex?: string,
    isAdmin?: string,
    status?: UserStatusOption,
    startDate?: string,
    endDate?: string,
};
