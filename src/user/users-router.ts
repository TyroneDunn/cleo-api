import {Request, Response, RequestHandler, Router} from "express";
import {DeleteUserDTO, GetUserDTO, GetUsersDTO, UpdateUserDTO} from "./users-dtos";
import {sendErrorResponse} from "../utils/send-error-response";
import {User} from "./user.type";
import {UsersController} from "./users-controller";

const mapRequestToGetUsersDTO = (req: Request) => {
    const dto: GetUsersDTO = {senderId: (req.user as User)._id.toString()};
    if (req.query.idRegex)
        dto.idRegex = req.query.idRegex as string;
    if (req.query.username)
        dto.username = req.query.username as string;
    if (req.query.usernameRegex)
        dto.usernameRegex = req.query.usernameRegex as string;
    if (req.query.sort) {
        if (req.query.sort === 'id')
            dto.sort = 'id';
        if (req.query.sort === 'username')
            dto.sort = 'username';
        if (req.query.sort === 'dateCreated')
            dto.sort = 'dateCreated';
        if (req.query.sort === 'lastUpdated')
            dto.sort = 'lastUpdated';
    }
    if (req.query.order)
        req.query.order === '-1' ? dto.order = -1 : dto.order = 1;
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

const getUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: GetUserDTO = {
            senderId: (req.user as User)._id.toString(),
            id: req.params.id,
        };
        const user: User = await UsersController.getUser(dto);
        res.json(user);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const getUsers: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto = mapRequestToGetUsersDTO(req);
        const users: User[] = await UsersController.getUsers(dto);
        res.json(users);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const deleteUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: DeleteUserDTO = {
            senderId: (req.user as User)._id.toString(),
            id: req.params.id,
        };
        res.json(await UsersController.deleteUser(dto));
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const updateUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const dto: UpdateUserDTO = {
            senderId: (req.user as User)._id.toString(),
            id: req.params.id,
        };
        if (req.body.username)
            dto.username = req.body.username;
        if (req.body.password)
            dto.password = req.body.password;
        const user = await UsersController.updateUser(dto);
        res.json(user);
    } catch (error) {
        sendErrorResponse(error, res);
    }
};

const usersRouter: Router = Router();
usersRouter.get('/:id', getUser);
usersRouter.get('/', getUsers);
usersRouter.delete('/:id', deleteUser);
usersRouter.patch('/:id', updateUser);

export default usersRouter;