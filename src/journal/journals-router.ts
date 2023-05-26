import {Router} from "express";
import {
    searchJournals,
    getJournal,
    searchJournal,
    getJournals,
    createJournal,
    deleteJournal,
    updateJournal,
} from "./mongo-journals-request-handler";

// For DB polymorphism
// export type JournalsRequestHandler = {};

const journalsRouter: Router = Router();
journalsRouter.get('/search/', searchJournals);
journalsRouter.get('/:id', getJournal);
journalsRouter.get('/:id/:search/', searchJournal);
journalsRouter.get('/', getJournals);
journalsRouter.post('/', createJournal);
journalsRouter.delete('/:id', deleteJournal);
journalsRouter.patch('/:id', updateJournal);

export default journalsRouter;
