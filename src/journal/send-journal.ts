import {Journal} from "./journal.type";
import {Response} from "express";
export const sendJournal = (res: Response) => {
    return (journal: Journal) => {
        res.json(journal);
    };
};