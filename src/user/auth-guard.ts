import {RequestHandler} from "express";
import {UNAUTHORIZED} from "../utils/http-status-constants";
import {Request, Response, NextFunction} from "express";

export const authGuard: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated())
        return res.status(UNAUTHORIZED).json('Unauthorized.');

    return next();
};