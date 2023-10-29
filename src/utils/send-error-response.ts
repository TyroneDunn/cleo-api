import {Response} from "express";
import {
    BadRequestError,
    ConflictError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError
} from "./errors";
import {
    BAD_REQUEST,
    CONFLICT, FORBIDDEN,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    UNAUTHORIZED
} from "./http-status-constants";

export const sendErrorResponse = (error: Error, res: Response): void => {
    if (error instanceof BadRequestError) {
        res.status(BAD_REQUEST).json({error: error.message});
        return;
    }
    if (error instanceof NotFoundError) {
        res.status(NOT_FOUND).json({error: error.message});
        return;
    }
    if (error instanceof UnauthorizedError) {
        res.status(UNAUTHORIZED).json({error: error.message});
        return;
    }
    if (error instanceof ConflictError) {
        res.status(CONFLICT).json({error: error.message});
        return;
    }
    if (error instanceof ForbiddenError) {
        res.status(FORBIDDEN).json({error: error.message});
        return;
    }

    res.status(INTERNAL_SERVER_ERROR).json({error: error.message});
};