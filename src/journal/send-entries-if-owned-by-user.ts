import {JournalEntry} from "../journal-entry/journal-entry.type";
import {User} from "../user/user.type";
import {userOwnsJournal} from "../utils/user-owns-journal";
import {Request, Response} from "express";
import {NOT_FOUND, UNAUTHORIZED} from "../utils/http-status-constants";

export const sendEntriesIfOwnedByUser = (req: Request, res: Response) => {
    return (entries: JournalEntry[]) => {
        if (entries.length === 0) {
            res.status(NOT_FOUND)
                .json('No entries found.');
            return;
        }

        if (!userOwnsJournal((req.user as User)._id.toString(), entries[0].journal)) {
            res.status(UNAUTHORIZED)
                .json(`Unauthorized access to journal ${req.query.id}`);
            return;
        }
        res.json(entries);
    };
};