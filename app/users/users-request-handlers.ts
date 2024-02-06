import {Request, RequestHandler, Response} from "express";
import {User, UserSortOption, UserStatusOption} from "./users.types";
import {
    deleteUser,
    deleteUsers,
    getUser,
    getUsers,
    updateUser,
    updateUsers
} from "./users.service";
import {
    DeleteUserRequest,
    DeleteUsersRequest,
    GetUserRequest,
    GetUsersRequest,
    UpdateUserRequest,
    UpdateUsersRequest
} from "./users-dtos";
import {sendErrorResponse} from "../utils/send-error-response";
import {OrderOption} from "../utils/order-option";

export const getUsersHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: GetUsersRequest = mapToGetUsersDTO(req);
        const users: User[] = await getUsers(req.user as User, dto);
        res.json(users);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const getUserHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: GetUserRequest = mapToGetUserDTO(req);
        const user: User = await getUser(req.user as User, dto);
        res.json(user);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const updateUsersHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: UpdateUsersRequest = mapToUpdateUsersDTO(req);
        const users: User[] = await updateUsers(req.user as User, dto);
        res.json(users);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const updateUserHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: UpdateUserRequest = mapToUpdateUserDTO(req);
        const user: User = await updateUser(req.user as User, dto);
        res.json(user);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const deleteUsersHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: DeleteUsersRequest = mapToDeleteUsersDTO(req);
        res.json(await deleteUsers(req.user as User, dto));
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const deleteUserHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: DeleteUserRequest = mapToDeleteUserDTO(req);
        const user: User = await deleteUser(req.user as User, dto);
        res.json(user);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const mapToGetUsersDTO = (req: Request): GetUsersRequest => ({
    ... req.query.username && {username: req.query.username as string},
    ... req.query.usernameRegex && {usernameRegex: req.query.usernameRegex as string},
    ... req.query.isAdmin && {isAdmin: (req.query.isAdmin as string)},
    ... req.query.status && {status: req.query.status as UserStatusOption},
    ... req.query.sort && {sort: req.query.sort as UserSortOption},
    ... req.query.order && {order: req.query.order as string as OrderOption},
    ... req.query.page && {page: parseInt(req.query.page as string)},
    ... req.query.limit && {limit: parseInt(req.query.limit as string)},
    ... req.query.startDate && {startDate: req.query.startDate as string},
    ... req.query.endDate && {endDate: req.query.endDate as string},
});

const mapToGetUserDTO = (req: Request): GetUserRequest =>
    ({username: req.params.username});

const mapToUpdateUsersDTO = (req: Request): UpdateUsersRequest => ({
    ... req.query.usernameRegex && {usernameRegex: req.query.usernameRegex as string},
    ... req.query.isAdmin && {isAdmin: (req.query.isAdmin as string)},
    ... req.query.status && {status: req.query.status as UserStatusOption},
    ... req.query.startDate && {startDate: req.query.startDate as string},
    ... req.query.endDate && {endDate: req.query.endDate as string},
    ... req.body.isAdmin && {newIsAdmin: req.body.isAdmin},
    ... req.body.status && {newStatus: req.body.status},
});

const mapToUpdateUserDTO = (req: Request): UpdateUserRequest => ({
    username: req.params.username,
    ... req.body.username && {newUsername: req.body.username},
    ... req.body.password && {newPassword: req.body.password},
    ... req.body.isAdmin && {newIsAdmin: req.body.isAdmin},
    ... req.body.status && {newStatus: req.body.status},
});

const mapToDeleteUsersDTO = (req: Request): DeleteUsersRequest => ({
    ... req.query.usernameRegex && {usernameRegex: req.query.usernameRegex as string},
    ... req.query.isAdmin && {isAdmin: (req.query.isAdmin as string)},
    ... req.query.status && {status: req.query.status as UserStatusOption},
    ... req.query.startDate && {startDate: req.query.startDate as string},
    ... req.query.endDate && {endDate: req.query.endDate as string},
});

const mapToDeleteUserDTO = (req: Request): DeleteUserRequest =>
    ({username: req.params.username});
