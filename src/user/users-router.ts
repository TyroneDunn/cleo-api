import {Router} from "express";
import {
    getUserHandler,
    getUsersHandler,
    deleteUserHandler,
    updateUserHandler
} from "./users-request-handlers";

const usersRouter: Router = Router();
usersRouter.get('/:id', getUserHandler);
usersRouter.get('/', getUsersHandler);
usersRouter.delete('/:id', deleteUserHandler);
usersRouter.patch('/:id', updateUserHandler);

export default usersRouter;