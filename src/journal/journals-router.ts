import {Router} from "express";
import {
    createJournalHandler,
    deleteJournalHandler,
    getJournalHandler,
    getJournalsHandler,
    updateJournalHandler
} from "./journals-request-handlers";

const journalsRouter: Router = Router();
journalsRouter.get('/', getJournalsHandler);
journalsRouter.get('/:id', getJournalHandler);
journalsRouter.post('/', createJournalHandler);
journalsRouter.delete('/:id', deleteJournalHandler);
journalsRouter.patch('/:id', updateJournalHandler);

export default journalsRouter;