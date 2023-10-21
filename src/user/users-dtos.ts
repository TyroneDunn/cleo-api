import {UserSortByOption, UserStatusOption} from "./user";
import {OrderOption} from "../utils/order-option";

export type GetUserDTO = {username: string};

export type GetUsersDTO = {
    username?: string,
    usernameRegex?: string,
    isAdmin?: string,
    status?: UserStatusOption,
    sort?: UserSortByOption,
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

export type DeleteUserDTO = {
    id: string,
};

export type UpdateUserDTO = {
    id?: string,
    username?: string,
    password?: string,
};
