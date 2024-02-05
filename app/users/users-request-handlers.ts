import {Request, RequestHandler, Response} from "express";
import {User, UserSortOption, UserStatusOption} from "./user";
import {
    deleteUser,
    deleteUsers,
    getUser,
    getUsers,
    updateUser,
    updateUsers
} from "./users-service";
import {
    DeleteUserDTO,
    DeleteUsersDTO,
    GetUserDTO,
    GetUsersDTO,
    UpdateUserDTO,
    UpdateUsersDTO
} from "./users-dtos";
import {sendErrorResponse} from "../utils/send-error-response";
import {OrderOption} from "../utils/order-option";

export const getUsersHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: GetUsersDTO = mapToGetUsersDTO(req);
        const users: User[] = await getUsers(req.user as User, dto);
        res.json(users);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const getUserHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: GetUserDTO = mapToGetUserDTO(req);
        const user: User = await getUser(req.user as User, dto);
        res.json(user);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const updateUsersHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: UpdateUsersDTO = mapToUpdateUsersDTO(req);
        const users: User[] = await updateUsers(req.user as User, dto);
        res.json(users);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const updateUserHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: UpdateUserDTO = mapToUpdateUserDTO(req);
        const user: User = await updateUser(req.user as User, dto);
        res.json(user);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const deleteUsersHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: DeleteUsersDTO = mapToDeleteUsersDTO(req);
        res.json(await deleteUsers(req.user as User, dto));
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const deleteUserHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: DeleteUserDTO = mapToDeleteUserDTO(req);
        const user: User = await deleteUser(req.user as User, dto);
        res.json(user);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const mapToGetUsersDTO = (req: Request): GetUsersDTO => ({
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

const mapToGetUserDTO = (req: Request): GetUserDTO =>
    ({username: req.params.username});

const mapToUpdateUsersDTO = (req: Request): UpdateUsersDTO => ({
    ... req.query.usernameRegex && {usernameRegex: req.query.usernameRegex as string},
    ... req.query.isAdmin && {isAdmin: (req.query.isAdmin as string)},
    ... req.query.status && {status: req.query.status as UserStatusOption},
    ... req.query.startDate && {startDate: req.query.startDate as string},
    ... req.query.endDate && {endDate: req.query.endDate as string},
    ... req.body.isAdmin && {newIsAdmin: req.body.isAdmin},
    ... req.body.status && {newStatus: req.body.status},
});

const mapToUpdateUserDTO = (req: Request): UpdateUserDTO => ({
    username: req.params.username,
    ... req.body.username && {newUsername: req.body.username},
    ... req.body.password && {newPassword: req.body.password},
    ... req.body.isAdmin && {newIsAdmin: req.body.isAdmin},
    ... req.body.status && {newStatus: req.body.status},
});

const mapToDeleteUsersDTO = (req: Request): DeleteUsersDTO => ({
    ... req.query.usernameRegex && {usernameRegex: req.query.usernameRegex as string},
    ... req.query.isAdmin && {isAdmin: (req.query.isAdmin as string)},
    ... req.query.status && {status: req.query.status as UserStatusOption},
    ... req.query.startDate && {startDate: req.query.startDate as string},
    ... req.query.endDate && {endDate: req.query.endDate as string},
});

const mapToDeleteUserDTO = (req: Request): DeleteUserDTO =>
    ({username: req.params.username});
