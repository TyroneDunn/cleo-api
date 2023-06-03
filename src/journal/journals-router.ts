import {Request, RequestHandler, Response, Router} from "express";
import {JournalsController} from "./journals-controller";
import {
    CreateJournalDTO,
    DeleteJournalDTO,
    GetJournalDTO,
    GetJournalsDTO,
    UpdateJournalDTO
} from "./journals-dtos";
import {User} from "../user/user";
import {sendErrorResponse} from "../utils/send-error-response";

const mapRequestToGetJournalDTO = (req: Request): GetJournalDTO =>  ({
        userId: (req.user as User)._id.toString(),
        id: req.params.id,
    });

const mapRequestToGetJournalsDTO = (req: Request): GetJournalsDTO => {
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
};

const mapRequestToCreateJournalDTO = (req: Request): CreateJournalDTO => ({
    userId: (req.user as User)._id.toString(),
    name: req.body.name,
});

const mapRequestToDeleteJournalDTO = (req: Request): DeleteJournalDTO => ({
    userId: (req.user as User)._id.toString(),
    id: req.params.id,
});

const mapRequestToUpdateJournalDTO = (req: Request): UpdateJournalDTO => ({
    userId: (req.user as User)._id.toString(),
    id: req.params.id,
    name: req.body.name,
});

const getJournal: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: GetJournalDTO = mapRequestToGetJournalDTO(req);
        const journal = await JournalsController.getJournal(dto);
        res.json(journal);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const getJournals: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const dto: GetJournalsDTO = mapRequestToGetJournalsDTO(req);
        const journals = await JournalsController.getJournals(dto);
        res.json(journals);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const createJournal: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: CreateJournalDTO = mapRequestToCreateJournalDTO(req);
        const journal = await JournalsController.createJournal(dto);
        res.json(journal);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const deleteJournal: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: DeleteJournalDTO = mapRequestToDeleteJournalDTO(req);
        const journal = await JournalsController.deleteJournal(dto);
        res.json(journal);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const updateJournal: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: UpdateJournalDTO = mapRequestToUpdateJournalDTO(req);
        const journal = await JournalsController.updateJournal(dto);
        res.json(journal);
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