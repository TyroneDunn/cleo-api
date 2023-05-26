import {Entry} from "../entry.type";
import {Journal} from "../../journal/journal.type";
import {journal$} from "../../journal/mongo-journals";
import {User} from "../../user/user.type";
import {Request, Response} from "express";
import {userOwnsJournal} from "../../utils/user-owns-journal";
import {NOT_FOUND, UNAUTHORIZED} from "../../utils/http-status-constants";

export const sendEntriesIfOwnedByUser = (req: Request, res: Response): void => {
    return (entries: Entry[]): void => {
        if (entries.length === 0) {
            res.status(NOT_FOUND)
                .json('No entries found.')
            return;
        }

        journal$(entries[0].journal).subscribe((journal: Journal | undefined) => {
            if (!userOwnsJournal((req.user as User)._id.toString(), journal)) {
                res.status(UNAUTHORIZED)
                    .json(`Unauthorized access to journal ${req.query.id}`);
                return;
            }
            res.json(entries);
        });
    };
};