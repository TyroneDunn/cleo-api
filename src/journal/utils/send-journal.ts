import {Journal} from "../journal.type";
import {Response} from "express";
export const sendJournal = (res: Response): void => {
    return (journal: Journal): void => {
        res.json(journal);
    };
};