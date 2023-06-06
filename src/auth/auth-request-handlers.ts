import {Request, RequestHandler, Response} from "express";
import {RegisterUserDTO} from "../user/users-dtos";
import {registerUser} from "../user/users-service";
import {CREATED, INTERNAL_SERVER_ERROR} from "../utils/http-status-constants";
import {sendErrorResponse} from "../utils/send-error-response";
import {User} from "../user/user";

import passport = require("passport");
export const authenticate = passport.authenticate('local');

export const register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: RegisterUserDTO = mapToRegisterUserDTO(req);
        const user = await registerUser(dto);
        res.status(CREATED).json(user);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const login: RequestHandler = (req: Request, res: Response): void => {
    res.json(`Logged in as ${(req.user as User).username}`);
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

export const authorizedStatus: RequestHandler = (req: Request, res: Response): void => {
    res.json(`Authenticated as ${(req.user as User).username}`);
};

const mapToRegisterUserDTO = (req: Request): RegisterUserDTO => ({
    username: req.body.username,
    password: req.body.password,
});