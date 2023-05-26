import {RequestHandler} from "express";
import {UNAUTHORIZED} from "../utils/http-status-constants";

export const authGuard = (req, res, next): RequestHandler => {
    if (!req.isAuthenticated())
        return res.status(UNAUTHORIZED).json('Unauthorized.');

    return next();
};