import {Entry} from "../entry.type";
import {Journal} from "../../journal/journal.type";
import {journal$} from "../../journal/mongo-journals-repository";
import {User} from "../../user/user.type";
import {userOwnsJournal} from "../../utils/user-owns-journal";
import {Response, Request} from "express";
import {NOT_FOUND, UNAUTHORIZED} from "../../utils/http-status-constants";

export const sendEntryIfOwnedByUser = (res: Response, req: Request) => (entry: Entry | undefined): void => {
    if (!entry) {
        res.status(NOT_FOUND)
            .json(`Journal entry ${req.params.id} not found.`);
        return;
    }
    const userId = (req.user as User)._id.toString();
    journal$(entry.journal as string).subscribe((journal: Journal | undefined) => {
        if (!userOwnsJournal(userId, journal)) {
            res.status(UNAUTHORIZED)
                .json(`Unauthorized access to entry ${req.params.id}`);
            return;
        }
        res.json(entry);
    });
};