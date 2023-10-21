import {User} from "../user/user";
import {Request, RequestHandler, Response} from "express";
import {
    CreateJournalDTO,
    DeleteJournalDTO,
    GetJournalDTO,
    GetJournalsDTO,
    UpdateJournalDTO
} from "./journals-dtos";
import {
    createJournal,
    deleteJournal,
    getJournal,
    getJournals,
    updateJournal,
} from "./journals-service";
import {sendErrorResponse} from "../utils/send-error-response";

export const getJournalHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: GetJournalDTO = mapToGetJournalDTO(req);
        const journal = await getJournal(req.user as User, dto);
        res.json(journal);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const getJournalsHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: GetJournalsDTO = mapToGetJournalsDTO(req);
        const journals = await getJournals(req.user as User, dto);
        res.json(journals);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const createJournalHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: CreateJournalDTO = mapToCreateJournalDTO(req);
        const journal = await createJournal(req.user as User, dto);
        res.json(journal);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const deleteJournalHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: DeleteJournalDTO = mapToDeleteJournalDTO(req);
        const journal = await deleteJournal(req.user as User, dto);
        res.json(journal);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const updateJournalHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: UpdateJournalDTO = mapToUpdateJournalDTO(req);
        const journal = await updateJournal(req.user as User, dto);
        res.json(journal);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const mapToGetJournalDTO = (req: Request): GetJournalDTO =>
    ({id: req.params.id});

const mapToGetJournalsDTO = (req: Request): GetJournalsDTO => ({
    ... req.query.idRegex && {idRegex: req.query.idRegex as string},
    ... req.query.name && {name: req.query.name as string},
    ... req.query.nameRegex && {nameRegex: req.query.nameRegex as string},
    ... req.query.author && {author: req.query.author as string},
    ... req.query.authorRegex && {authorRegex: req.query.authorRegex as string},
    ... req.query.startDate && {startDate: req.query.startDate as string},
    ... req.query.endDate && {endDate: req.query.endDate as string},
    ... req.query.sort && {sort: req.query.sort as "name" | "author" | "id" | "dateCreated" | "lastUpdated"},
    ... req.query.order && {order: parseInt(req.query.order as string) as 1 | -1},
    ... req.query.page && {page: parseInt(req.query.page as string)},
    ... req.query.limit && {limit: parseInt(req.query.limit as string)},
});

const mapToCreateJournalDTO = (req: Request): CreateJournalDTO => ({
    author: (req.user as User)._id.toString(),
    name: req.body.name,
});

const mapToDeleteJournalDTO = (req: Request): DeleteJournalDTO =>
    ({id: req.params.id});

const mapToUpdateJournalDTO = (req: Request): UpdateJournalDTO => ({
    id: req.params.id,
    name: req.body.name,
});