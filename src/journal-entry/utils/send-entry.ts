import {JournalEntry} from "../journal-entry.type";
import {Response} from "express";

export const sendEntry = (res: Response) => {
    return (entry: JournalEntry) => res.json(entry);
};