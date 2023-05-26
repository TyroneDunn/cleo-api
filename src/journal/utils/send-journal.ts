import {Journal} from "../journal.type";
import {Response} from "express";
export const sendJournal = (res: Response) => (journal: Journal): void => {
    res.json(journal);
};