import {Entry} from "../entry.type";
import {Response} from "express";

export const sendEntry = (res: Response) => {
    return (entry: Entry) => res.json(entry);
};