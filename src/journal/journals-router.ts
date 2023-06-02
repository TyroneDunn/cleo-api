import {Request, RequestHandler, Response, Router} from "express";
import {JournalsController} from "./journals-controller";
import {
    CreateJournalDTO,
    DeleteJournalDTO,
    GetJournalDTO,
    GetJournalsDTO,
    UpdateJournalDTO
} from "./journals-dtos";
import {
    BadRequestError,
    NotFoundError,
    UnauthorizedError
} from "../utils/errors";
import {
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    UNAUTHORIZED
} from "../utils/http-status-constants";
import {User} from "../user/user.type";

const sendErrorResponse = (error: Error, res: Response): void => {
    if (error instanceof BadRequestError) {
        res.status(BAD_REQUEST).json(error.message)
        return;
    }
    if (error instanceof NotFoundError) {
        res.status(NOT_FOUND).json(error.message)
        return;
    }
    if (error instanceof UnauthorizedError) {
        res.status(UNAUTHORIZED).json(error.message)
        return;
    }

    res.status(INTERNAL_SERVER_ERROR).json(error.message)
};

const mapRequest = {
    toGetJournalDTO: (req: Request): GetJournalDTO => ({
        userId: (req.user as User)._id.toString(),
        id: req.params.id,
    }),

    toGetJournalsDTO: (req: Request): GetJournalsDTO => {
        const dto: GetJournalsDTO = {userId: (req.user as User)._id.toString()}
        if (req.query.name)
            dto.name = req.query.name as string;
        if (req.query.nameRegex)
            dto.nameRegex = req.query.nameRegex as string;
        if (req.query.sort) {
            if (req.query.sort === 'id')
                dto.sort = 'id';
            if (req.query.sort === 'name')
                dto.sort = 'name';
            if (req.query.sort === 'author')
                dto.sort = 'author';
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
    },

    toCreateJournalDTO: (req: Request): CreateJournalDTO => ({
        userId: (req.user as User)._id.toString(),
        name: req.body.name,
    }),

    toDeleteJournalDTO: (req: Request): DeleteJournalDTO => ({
        userId: (req.user as User)._id.toString(),
        id: req.params.id,
    }),

    toUpdateJournalDTO: (req: Request): UpdateJournalDTO => ({
        userId: (req.user as User)._id.toString(),
        id: req.params.id,
        name: req.body.name,
    }),
}

const getJournal: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: GetJournalDTO = mapRequest.toGetJournalDTO(req);
        res.json(await JournalsController.getJournal(dto));
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const getJournals: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: GetJournalsDTO = mapRequest.toGetJournalsDTO(req);
        res.json(await JournalsController.getJournals(dto));
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const createJournal: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: CreateJournalDTO = mapRequest.toCreateJournalDTO(req);
        res.json(await JournalsController.createJournal(dto));
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const deleteJournal: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: DeleteJournalDTO = mapRequest.toDeleteJournalDTO(req);
        res.json(await JournalsController.deleteJournal(dto));
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const updateJournal: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: UpdateJournalDTO = mapRequest.toUpdateJournalDTO(req);
        res.json(await JournalsController.updateJournal(dto));
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const journalsRouter: Router = Router();
journalsRouter.get('/:id', getJournal);
journalsRouter.get('/', getJournals);
journalsRouter.post('/', createJournal);
journalsRouter.delete('/:id', deleteJournal);
journalsRouter.patch('/:id', updateJournal);

export default journalsRouter;