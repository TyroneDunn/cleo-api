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
import {JOURNALS_REPOSITORY} from "../utils/config";

const journalsRouter = {
    router: Router(),
    repository: JOURNALS_REPOSITORY,
};

journalsRouter.router.get('/search/', searchJournals);
journalsRouter.router.get('/:id', getJournal);
journalsRouter.router.get('/:id/:search/', searchJournal);
journalsRouter.router.get('/', getJournals);
journalsRouter.router.post('/', createJournal);
journalsRouter.router.delete('/:id', deleteJournal);
journalsRouter.router.patch('/:id', updateJournal);

export default journalsRouter;