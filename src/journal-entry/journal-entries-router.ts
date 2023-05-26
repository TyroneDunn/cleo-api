import {Router} from "express";
import {
    searchEntries,
    getEntry,
    getJournalEntries,
    createEntry,
    deleteEntry,
    updateEntry
} from "./mongo-entries-request-handler"

const journalEntriesRouter: Router = Router();
journalEntriesRouter.get('/search/', searchEntries);
journalEntriesRouter.get('/:id', getEntry);
journalEntriesRouter.get('', getJournalEntries);
journalEntriesRouter.post('/:id', createEntry);
journalEntriesRouter.delete('/:id', deleteEntry);
journalEntriesRouter.patch('/:id', updateEntry);
export default journalEntriesRouter;
