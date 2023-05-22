import {RequestHandler} from "express";
import {HTTP_STATUS_UNAUTHORIZED} from "../utils/environment";

export default function authGuard (req, res, next): RequestHandler  {
    if (!req.isAuthenticated())
        return res.status(HTTP_STATUS_UNAUTHORIZED).json('Unauthorized.');

    return next();
};
