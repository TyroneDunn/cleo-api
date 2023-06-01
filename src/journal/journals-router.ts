import {Request, RequestHandler, Response, Router} from "express";
import {JournalsController} from "./journals-controller";
import {
    CreateJournalDTO,
    DeleteJournalDTO,
    GetJournalDTO,
    GetJournalsDTO,
    UpdateJournalDTO
} from "./journal-dtos";
import {BadRequestError, NotFoundError, UnauthorizedError} from "../utils/errors";
import {BAD_REQUEST, NOT_FOUND, UNAUTHORIZED} from "../utils/http-status-constants";
import {User} from "../user/user.type";

const sendErrorResponse = (error: Error, res: Response): void => {
    if (error instanceof BadRequestError)
        res.status(BAD_REQUEST).json(error)
    if (error instanceof NotFoundError)
        res.status(NOT_FOUND).json(error)
    if (error instanceof UnauthorizedError)
        res.status(UNAUTHORIZED).json(error)
};

const mapRequest = {
    toGetJournalDTO: (req: Request): GetJournalDTO => ({
        userId: (req.user as User)._id.toString(),
        id: req.params.id,
    }),
    toGetJournalsDTO: (req: Request): GetJournalsDTO => ({
        userId: (req.user as User)._id.toString(),
    }),

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