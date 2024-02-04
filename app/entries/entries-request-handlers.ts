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
import {
    CreateEntryRequest,
    DeleteEntriesRequest,
    DeleteEntryRequest,
    Entry,
    EntrySortOption, GetEntriesRequest, GetEntryRequest,
    UpdateEntryRequest,
} from "./entries.types";
import {OrderOption} from "../utils/order-option";
import {PaginatedResponse} from "../utils/paginated-response";

export const getEntryHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: GetEntryRequest = mapToGetEntryDTO(req);
        const entry = await getEntry(req.user as User, dto);
        res.json(entry);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const getEntriesHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: GetEntriesRequest = mapToGetEntriesDTO(req);
        let getEntriesResponse: PaginatedResponse<Entry> = await getEntries(req.user as User, dto);
        res.json(getEntriesResponse);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const createEntryHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: CreateEntryRequest = mapToCreateEntryDTO(req);
        const entry = await createEntry(req.user as User, dto);
        res.json(entry);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const updateEntryHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: UpdateEntryRequest = mapToUpdateEntryDTO(req);
        const entry = await updateEntry(req.user as User, dto);
        res.json(entry);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const deleteEntryHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: DeleteEntryRequest = mapToDeleteEntryDTO(req);
        const entry = await deleteEntry(req.user as User, dto);
        res.json(entry);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const deleteEntriesHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: DeleteEntriesRequest = mapToDeleteEntriesDTO(req);
        const result = await deleteEntries(req.user as User, dto);
        res.json(result);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const mapToGetEntryDTO = (req: Request): GetEntryRequest =>
    ({id: req.params.id});

const mapToGetEntriesDTO = (req: Request): GetEntriesRequest => ({
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

const mapToCreateEntryDTO = (req: Request): CreateEntryRequest => ({
    journal: req.params.id,
    title: req.body.title,
    body: req.body.body,
});

const mapToUpdateEntryDTO = (req: Request): UpdateEntryRequest => ({
    id: req.params.id,
    ... req.body.journal && {journal: req.body.journal},
    ... req.body.title && {title: req.body.title},
    ... req.body.body && {body: req.body.body},
});

const mapToDeleteEntryDTO = (req: Request): DeleteEntryRequest =>
    ({id: req.params.id});

const mapToDeleteEntriesDTO = (req: Request): DeleteEntriesRequest => ({
    ... req.query.journal && {journal: req.query.journal as string},
    ... req.query.title && {title: req.query.title as string},
    ... req.query.titleRegex && {titleRegex: req.query.titleRegex as string},
    ... req.query.body && {body: req.query.body as string},
    ... req.query.bodyRegex && {bodyRegex: req.query.bodyRegex as string},
    ... req.query.startDate && {startDate: req.query.startDate as string},
    ... req.query.endDate && {endDate: req.query.endDate as string},
});
