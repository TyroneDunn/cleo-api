import {User} from "./user";
import {UsersService} from "./users-service";
import {Request, RequestHandler, Response} from "express";
import {DeleteUserDTO, GetUserDTO, GetUsersDTO, UpdateUserDTO} from "./users-dtos";
import {sendErrorResponse} from "../utils/send-error-response";

export const getUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: GetUserDTO = mapToGetUserDTO(req);
        const user: User = await UsersService.getUser(req.user as User, dto);
        res.json(user);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const getUsers: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: GetUsersDTO = mapToGetUsersDTO(req);
        const users: User[] = await UsersService.getUsers(req.user as User, dto);
        res.json(users);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const deleteUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: DeleteUserDTO = mapToDeleteUserDTO(req);
        const user: User = await UsersService.deleteUser(req.user as User, dto);
        res.json(user);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const updateUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: UpdateUserDTO = mapToUpdateUserDTO(req);
        const user: User = await UsersService.updateUser(req.user as User, dto);
        res.json(user);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const mapToGetUserDTO = (req: Request): GetUserDTO => ({
    id: req.params.id,
});

const mapToGetUsersDTO = (req: Request): GetUsersDTO => ({
    ... req.query.idRegex && {id: req.query.idRegex as string},
    ... req.query.username && {username: req.query.username as string},
    ... req.query.usernameRegex && {usernameRegex: req.query.usernameRegex as string},
    ... req.query.sort && {sort: req.query.sort as "username" | "id" | "dateCreated" | "lastUpdated"},
    ... req.query.order && {order: parseInt(req.query.order as string) as 1 | -1},
    ... req.query.page && {page: parseInt(req.query.page as string)},
    ... req.query.limit && {limit: parseInt(req.query.page as string)},
    ... req.query.startDate && {startDate: new Date(req.query.startDate as string)},
    ... req.query.endDate && {endDate: new Date(req.query.endDate as string)},
});

const mapToDeleteUserDTO = (req: Request): DeleteUserDTO => ({
    id: req.params.id,
});

const mapToUpdateUserDTO = (req: Request): UpdateUserDTO => {
    return {
        id: req.params.id,
        ... req.body.username && {username: req.body.username},
        ... req.body.password && {password: req.body.password},
    }
};