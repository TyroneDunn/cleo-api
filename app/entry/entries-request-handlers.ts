import {
    GetEntryDTO,
    GetEntriesDTO,
    CreateEntryDTO,
    UpdateEntryDTO,
    DeleteEntriesDTO,
    DeleteEntryDTO,
} from "./entries-dtos";
import {
    getEntry,
    getEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    deleteEntries,
} from "./entries-service";
import {User} from "../user/user";
import {Request, RequestHandler, Response} from "express";
import {sendErrorResponse} from "../utils/send-error-response";
import {Entry, EntrySortOption} from "./entry";
import {OrderOption} from "../utils/order-option";
import {PaginatedResponse} from "../utils/paginated-response";

export const getEntryHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: GetEntryDTO = mapToGetEntryDTO(req);
        const entry = await getEntry(req.user as User, dto);
        res.json(entry);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const getEntriesHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: GetEntriesDTO = mapToGetEntriesDTO(req);
        let getEntriesResponse: PaginatedResponse<Entry> = await getEntries(req.user as User, dto);
        res.json(getEntriesResponse);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const createEntryHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: CreateEntryDTO = mapToCreateEntryDTO(req);
        const entry = await createEntry(req.user as User, dto);
        res.json(entry);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const updateEntryHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: UpdateEntryDTO = mapToUpdateEntryDTO(req);
        const entry = await updateEntry(req.user as User, dto);
        res.json(entry);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const deleteEntryHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: DeleteEntryDTO = mapToDeleteEntryDTO(req);
        const entry = await deleteEntry(req.user as User, dto);
        res.json(entry);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const deleteEntriesHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: DeleteEntriesDTO = mapToDeleteEntriesDTO(req);
        const result = await deleteEntries(req.user as User, dto);
        res.json(result);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const mapToGetEntryDTO = (req: Request): GetEntryDTO =>
    ({id: req.params.id});

const mapToGetEntriesDTO = (req: Request): GetEntriesDTO => ({
    ... req.query.journal && {journal: req.query.journal as string},
    ... req.query.title && {title: req.query.title as string},
    ... req.query.titleRegex && {titleRegex: req.query.titleRegex as string},
    ... req.query.body && {body: req.query.body as string},
    ... req.query.bodyRegex && {bodyRegex: req.query.bodyRegex as string},
    ... req.query.startDate && {startDate: req.query.startDate as string},
    ... req.query.endDate && {endDate: req.query.endDate as string},
    ... req.query.sort && {sort: req.query.sort as EntrySortOption},
    ... req.query.order && {order: req.query.order as OrderOption},
    ... req.query.page && {page: parseInt(req.query.page as string)},
    ... req.query.limit && {limit: parseInt(req.query.limit as string)},
});

const mapToCreateEntryDTO = (req: Request): CreateEntryDTO => ({
    journal: req.params.id,
    title: req.body.title,
    body: req.body.body,
});

const mapToUpdateEntryDTO = (req: Request): UpdateEntryDTO => ({
    id: req.params.id,
    ... req.body.journal && {journal: req.body.journal},
    ... req.body.title && {title: req.body.title},
    ... req.body.body && {body: req.body.body},
});

const mapToDeleteEntryDTO = (req: Request): DeleteEntryDTO =>
    ({id: req.params.id});

const mapToDeleteEntriesDTO = (req: Request): DeleteEntriesDTO => ({
    ... req.query.journal && {journal: req.query.journal as string},
    ... req.query.title && {title: req.query.title as string},
    ... req.query.titleRegex && {titleRegex: req.query.titleRegex as string},
    ... req.query.body && {body: req.query.body as string},
    ... req.query.bodyRegex && {bodyRegex: req.query.bodyRegex as string},
    ... req.query.startDate && {startDate: req.query.startDate as string},
    ... req.query.endDate && {endDate: req.query.endDate as string},
});