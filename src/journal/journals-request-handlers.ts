import {User} from "../user/user";
import {Request, RequestHandler, Response} from "express";
import {
    CreateJournalDTO,
    DeleteJournalDTO,
    GetJournalDTO,
    GetJournalsDTO,
    UpdateJournalDTO
} from "./journals-dtos";
import {JournalsService} from "./journals-service";
import {sendErrorResponse} from "../utils/send-error-response";

export const getJournal: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: GetJournalDTO = mapToGetJournalDTO(req);
        const journal = await JournalsService.getJournal(req.user as User, dto);
        res.json(journal);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const getJournals: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: GetJournalsDTO = mapToGetJournalsDTO(req);
        const journals = await JournalsService.getJournals(req.user as User, dto);
        res.json(journals);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const createJournal: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: CreateJournalDTO = mapToCreateJournalDTO(req);
        const journal = await JournalsService.createJournal(req.user as User, dto);
        res.json(journal);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const deleteJournal: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: DeleteJournalDTO = mapToDeleteJournalDTO(req);
        const journal = await JournalsService.deleteJournal(req.user as User, dto);
        res.json(journal);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

export const updateJournal: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: UpdateJournalDTO = mapToUpdateJournalDTO(req);
        const journal = await JournalsService.updateJournal(req.user as User, dto);
        res.json(journal);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const mapToGetJournalDTO = (req: Request): GetJournalDTO =>
    ({id: req.params.id});

const mapToGetJournalsDTO = (req: Request): GetJournalsDTO => ({
    ... req.query.name && {name: req.query.name as string},
    ... req.query.nameRegex && {nameRegex: req.query.nameRegex as string},
    ... req.query.sort && {sort: req.query.sort as "name" | "author" | "id" | "dateCreated" | "lastUpdated"},
    ... req.query.order && {order: parseInt(req.query.order as string) as 1 | -1},
    ... req.query.page && {page: parseInt(req.query.page as string)},
    ... req.query.limit && {limit: parseInt(req.query.page as string)},
    ... req.query.startDate && {startDate: new Date(req.query.startDate as string)},
    ... req.query.endDate && {endDate: new Date(req.query.endDate as string)},
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