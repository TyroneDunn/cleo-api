import {Entry} from "../entry.type";
import {Response} from "express";

export const sendEntry = (res: Response): void => {
    return (entry: Entry) => res.json(entry);
};