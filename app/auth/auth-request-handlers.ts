import {NextFunction, Request, RequestHandler, Response} from "express";
import {CREATED, INTERNAL_SERVER_ERROR, UNAUTHORIZED} from "../utils/http-status-constants";
import {RegisterAdminDTO, RegisterUserDTO} from "../user/users-dtos";
import {registerAdminUser, registerUser} from "../user/users-service";
import {sendErrorResponse} from "../utils/send-error-response";
import {User} from "../user/user";
import passport = require("passport");

export const authenticate: RequestHandler = passport.authenticate('local');

export const authGuard: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated())
        return res.status(UNAUTHORIZED).json('Unauthorized.');
    return next();
};

export const register: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const dto: RegisterUserDTO = mapToRegisterUserDTO(req);
        await registerUser(dto);
        return next();
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

