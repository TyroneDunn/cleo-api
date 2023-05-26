import {Journal} from "../journal.type";
import {Response} from "express";
import {NOT_FOUND} from "../../utils/http-status-constants";

export const sendJournals = (res: Response): void => {
    return (journals: Journal[]): void => {
        if (journals.length === 0) {
            res.status(NOT_FOUND)
                .json('No journals found.');
            return;
        }
        res.json(journals);
    };
};