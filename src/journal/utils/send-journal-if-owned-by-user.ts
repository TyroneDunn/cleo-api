import {Journal} from "../journal.type";
import {User} from "../../user/user.type";
import {Request, Response} from "express";
import {userOwnsJournal} from '../../utils/user-owns-journal';
import {NOT_FOUND, UNAUTHORIZED} from "../../utils/http-status-constants";

export const sendJournalIfOwnedByUser = (req: Request, res: Response): void => {
    return (journal: Journal | undefined) => {
        if (!journal) {
            res.status(NOT_FOUND)
                .json(`Journal ${(req.params.id)} not found.`);
            return;
        }

        if (!userOwnsJournal((req.user as User)._id.toString(), journal)) {
            res.status(UNAUTHORIZED)
                .json(`Unauthorized access to journal ${req.params.id}`);
            return;
        }
        res.json(journal);
    };
};