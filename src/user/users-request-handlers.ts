import {NextFunction, Request, RequestHandler, Response} from "express";
import {User, UserSortByOption, UserStatusOption} from "./user";
import {
    deleteUser,
    deleteUsers,
    getUser,
    getUsers,
    registerAdminUser,
    registerUser,
    updateUser,
    updateUsers
} from "./users-service";
import {
    DeleteUserDTO,
    DeleteUsersDTO,
    GetUserDTO,
    GetUsersDTO,
    RegisterAdminDTO,
    RegisterUserDTO,
    UpdateUserDTO,
    UpdateUsersDTO
} from "./users-dtos";
import {sendErrorResponse} from "../utils/send-error-response";
import {
    CREATED,
    INTERNAL_SERVER_ERROR,
    UNAUTHORIZED
} from "../utils/http-status-constants";
import {OrderOption} from "../utils/order-option";
import passport = require("passport");

export const authenticate: RequestHandler = passport.authenticate('local');

export const authGuard: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated())
        return res.status(UNAUTHORIZED).json('Unauthorized.');
    return next();
};

export const register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: RegisterUserDTO = mapToRegisterUserDTO(req);
        const user = await registerUser(dto);
        res.status(CREATED).json(user);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const registerAdmin: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: RegisterAdminDTO = mapToRegisterAdminDTO(req);
        const user = await registerAdminUser(req.user as User, dto);
        res.status(CREATED).json(user);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const authenticatedResponse: RequestHandler = (req: Request, res: Response): void => {
    res.json({"username": (req.user as User).username});
};

export const loggedInResponse: RequestHandler = (req: Request, res: Response): void => {
    res.json({"username": (req.user as User).username});
};

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

export const logout: RequestHandler = (req: Request, res: Response): void => {
    req.logout((error) => {
        if (error) {
            res.status(INTERNAL_SERVER_ERROR).json('Log out failed.');
            return;
        }
        res.json('Logged out successfully.');
    });
};

const mapToRegisterUserDTO = (req: Request): RegisterUserDTO => ({
    username: req.body.username,
    password: req.body.password,
});

const mapToRegisterAdminDTO = (req: Request): RegisterAdminDTO => ({
    username: req.body.username,
    password: req.body.password,
});

const mapToGetUsersDTO = (req: Request): GetUsersDTO => ({
    ... req.query.username && {username: req.query.username as string},
    ... req.query.usernameRegex && {usernameRegex: req.query.usernameRegex as string},
    ... req.query.isAdmin && {isAdmin: (req.query.isAdmin as string)},
    ... req.query.status && {status: req.query.status as UserStatusOption},
    ... req.query.sort && {sort: req.query.sort as UserSortByOption},
    ... req.query.order && {order: parseInt(req.query.order as string) as OrderOption},
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
