import {Router} from "express";
import {
    createJournalHandler,
    deleteJournalHandler,
    deleteJournalsHandler,
    getJournalHandler,
    getJournalsHandler,
    updateJournalHandler
} from "./journals-request-handlers";

const journalsRouter: Router = Router();
journalsRouter.get('/', getJournalsHandler);
journalsRouter.get('/:id', getJournalHandler);
journalsRouter.post('/', createJournalHandler);
journalsRouter.patch('/:id', updateJournalHandler);
journalsRouter.delete('/', deleteJournalsHandler);
journalsRouter.delete('/:id', deleteJournalHandler);

export default journalsRouter;