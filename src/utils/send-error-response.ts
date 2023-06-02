import {Response} from "express";
import {BadRequestError, NotFoundError, UnauthorizedError} from "./errors";
import {BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED} from "./http-status-constants";

export const sendErrorResponse = (error: Error, res: Response): void => {
    if (error instanceof BadRequestError) {
        res.status(BAD_REQUEST).json(error.message)
        return;
    }
    if (error instanceof NotFoundError) {
        res.status(NOT_FOUND).json(error.message)
        return;
    }
    if (error instanceof UnauthorizedError) {
        res.status(UNAUTHORIZED).json(error.message)
        return;
    }

    res.status(INTERNAL_SERVER_ERROR).json(error.message)
};