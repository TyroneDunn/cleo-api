import {Router} from "express";
import {
    createJournal,
    deleteJournal,
    getJournal,
    getJournals,
    updateJournal
} from "./journals-request-handlers";

const journalsRouter: Router = Router();
journalsRouter.get('/:id', getJournal);
journalsRouter.get('/', getJournals);
journalsRouter.post('/', createJournal);
journalsRouter.delete('/:id', deleteJournal);
journalsRouter.patch('/:id', updateJournal);

export default journalsRouter;