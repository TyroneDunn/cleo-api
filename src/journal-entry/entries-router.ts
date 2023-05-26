import {Router} from "express";
import {
    searchEntries,
    getEntry,
    getJournalEntries,
    createEntry,
    deleteEntry,
    updateEntry
} from "./mongo-entries-request-handler"

const entriesRouter: Router = Router();
entriesRouter.get('/search/', searchEntries);
entriesRouter.get('/:id', getEntry);
entriesRouter.get('', getJournalEntries);
entriesRouter.post('/:id', createEntry);
entriesRouter.delete('/:id', deleteEntry);
entriesRouter.patch('/:id', updateEntry);
export default entriesRouter;
