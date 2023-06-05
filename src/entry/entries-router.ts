import {Router} from "express";
import {
    createEntry,
    deleteEntry,
    getEntries,
    getEntry,
    updateEntry
} from "./entries-request-handlers";

const entriesRouter: Router = Router();
entriesRouter.get('/:id', getEntry);
entriesRouter.get('', getEntries);
entriesRouter.post('/:id', createEntry);
entriesRouter.delete('/:id', deleteEntry);
entriesRouter.patch('/:id', updateEntry);

export default entriesRouter;