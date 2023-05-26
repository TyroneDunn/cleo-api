import {JournalEntry} from "../journal-entry.type";
import {Response} from "express";
import {NOT_FOUND} from "../../utils/http-status-constants";

export const sendEntries = (res: Response) => {
    return (entries: JournalEntry[]) => {
        if (entries.length === 0) {
            res.status(NOT_FOUND)
                .json('No entries found.');
            return;
        }
        res.json(entries);
    };
};