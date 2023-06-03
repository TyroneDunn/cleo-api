import {Request, RequestHandler, Response, Router} from "express";
import {EntriesController} from "./entries-controller";
import {
    CreateEntryDTO,
    DeleteEntryDTO,
    GetEntriesDTO,
    GetEntryDTO,
    UpdateEntryDTO
} from "./entries-dtos";
import {User} from "../user/user";
import {sendErrorResponse} from "../utils/send-error-response";

const mapRequestToGetEntryDTO = (req: Request): GetEntryDTO => ({
    userId: (req.user as User)._id.toString(),
    id: req.params.id,
});

const mapRequestToGetEntriesDTO = (req: Request): GetEntriesDTO => {
    const dto: GetEntriesDTO = {userId: (req.user as User)._id.toString()}
    if (req.query.id)
        dto.journal = req.query.id as string;
    if (req.query.body)
        dto.body = req.query.body as string;
    if (req.query.bodyRegex)
        dto.bodyRegex = req.query.bodyRegex as string;
    if (req.query.sort) {
        if (req.query.sort === 'id')
            dto.sort = 'id';
        if (req.query.sort === 'body')
            dto.sort = 'body';
        if (req.query.sort === 'journal')
            dto.sort = 'journal';
        if (req.query.sort === 'dateCreated')
            dto.sort = 'dateCreated';
        if (req.query.sort === 'lastUpdated')
            dto.sort = 'lastUpdated';
    }
    if (req.query.order)
        req.query.order === '-1'? dto.order = -1: dto.order = 1;
    if (req.query.page)
        dto.page = parseInt(req.query.page as string);
    if (req.query.limit)
        dto.limit = parseInt(req.query.limit as string);
    if (req.query.startDate)
        dto.startDate = new Date(req.query.startdate as string)
    if (req.query.endDate)
        dto.endDate = new Date(req.query.enddate as string)
    return dto;
};

const mapRequestToCreateEntryDTO = (req: Request): CreateEntryDTO => ({
    userId: (req.user as User)._id.toString(),
    journal: req.params.id,
    body: req.body.body,
});

const mapRequestToDeleteEntryDTO = (req: Request): DeleteEntryDTO => ({
    userId: (req.user as User)._id.toString(),
    id: req.params.id,
});

const mapRequestToUpdateEntryDTO = (req: Request): UpdateEntryDTO => ({
    userId: (req.user as User)._id.toString(),
    id: req.params.id,
    journal: req.body.journal,
    body: req.body.body,
});

const getEntry: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: GetEntryDTO = mapRequestToGetEntryDTO(req);
        res.json(await EntriesController.getEntry(dto));
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const getEntries: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: GetEntriesDTO = mapRequestToGetEntriesDTO(req);
        let entries = await EntriesController.getEntries(dto);
        res.json(entries);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const createEntry: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: CreateEntryDTO = mapRequestToCreateEntryDTO(req);
        res.json(await EntriesController.createEntry(dto));
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const deleteEntry: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: DeleteEntryDTO = mapRequestToDeleteEntryDTO(req);
        res.json(await EntriesController.deleteEntry(dto));
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const updateEntry: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: UpdateEntryDTO = mapRequestToUpdateEntryDTO(req);
        res.json(await EntriesController.updateEntry(dto));
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const entriesRouter: Router = Router();
entriesRouter.get('/:id', getEntry);
entriesRouter.get('', getEntries);
entriesRouter.post('/:id', createEntry);
entriesRouter.delete('/:id', deleteEntry);
entriesRouter.patch('/:id', updateEntry);

export default entriesRouter;