import {User} from "../user/user";
import {
    Request,
    RequestHandler,
    Response
} from "express";
import {
    getJournal,
    getJournals,
    createJournal,
    updateJournal,
    deleteJournal,
    deleteJournals,
} from "./journals-service";
import {sendErrorResponse} from "../utils/send-error-response";
import {
    CreateJournalRequest,
    DeleteJournalRequest,
    DeleteJournalsRequest, GetJournalRequest, GetJournalsRequest,
    Journal,
    JournalSortOption, UpdateJournalRequest,
} from "./journals.types";
import {OrderOption} from "../utils/order-option";
import {PaginatedResponse} from "../utils/paginated-response";

export const getJournalHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: GetJournalRequest = mapToGetJournalDTO(req);
        const journal = await getJournal(req.user as User, dto);
        res.json(journal);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const getJournalsHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: GetJournalsRequest = mapToGetJournalsDTO(req);
        const response: PaginatedResponse<Journal> = await getJournals(req.user as User, dto);
        res.json(response);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const createJournalHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: CreateJournalRequest = mapToCreateJournalDTO(req);
        const journal = await createJournal(req.user as User, dto);
        res.json(journal);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const updateJournalHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: UpdateJournalRequest = mapToUpdateJournalDTO(req);
        const journal = await updateJournal(req.user as User, dto);
        res.json(journal);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const deleteJournalHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: DeleteJournalRequest = mapToDeleteJournalDTO(req);
        const journal = await deleteJournal(req.user as User, dto);
        res.json(journal);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const deleteJournalsHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
     try {
         const dto: DeleteJournalsRequest = mapToDeleteJournalsDTO(req);
         const result = await deleteJournals(req.user as User, dto);
         res.json(result);
     } catch (error) {
         sendErrorResponse(error, res);
     }
};

const mapToGetJournalDTO = (req: Request): GetJournalRequest =>
    ({id: req.params.id});

const mapToGetJournalsDTO = (req: Request): GetJournalsRequest => ({
    ... req.query.name && {name: req.query.name as string},
    ... req.query.nameRegex && {nameRegex: req.query.nameRegex as string},
    ... req.query.author && {author: req.query.author as string},
    ... req.query.authorRegex && {authorRegex: req.query.authorRegex as string},
    ... req.query.startDate && {startDate: req.query.startDate as string},
    ... req.query.endDate && {endDate: req.query.endDate as string},
    ... req.query.sort && {sort: req.query.sort as JournalSortOption},
    ... req.query.order && {order: req.query.order as string as OrderOption},
    ... req.query.page && {page: parseInt(req.query.page as string)},
    ... req.query.limit && {limit: parseInt(req.query.limit as string)},
});

const mapToCreateJournalDTO = (req: Request): CreateJournalRequest => ({
    author: (req.user as User).username,
    name: req.body.name,
});

const mapToUpdateJournalDTO = (req: Request): UpdateJournalRequest => ({
    id: req.params.id,
    ... req.body.name && {name: req.body.name},
});

const mapToDeleteJournalDTO = (req: Request): DeleteJournalRequest =>
    ({id: req.params.id});

const mapToDeleteJournalsDTO = (req: Request): DeleteJournalsRequest => ({
    ... req.query.name && {name: req.query.name as string},
    ... req.query.nameRegex && {nameRegex: req.query.nameRegex as string},
    ... req.query.author && {author: req.query.author as string},
    ... req.query.authorRegex && {authorRegex: req.query.authorRegex as string},
    ... req.query.startDate && {startDate: req.query.startDate as string},
    ... req.query.endDate && {endDate: req.query.endDate as string},
});
