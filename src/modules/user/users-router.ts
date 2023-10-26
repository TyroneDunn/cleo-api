import {Router} from "express";
import {
    getUserHandler,
    getUsersHandler,
    deleteUserHandler,
    updateUserHandler,
    updateUsersHandler,
    deleteUsersHandler,
} from "./users-request-handlers";

const usersRouter: Router = Router();

usersRouter.get('/', getUsersHandler);
usersRouter.get('/:username', getUserHandler);
usersRouter.patch('/', updateUsersHandler);
usersRouter.patch('/:username', updateUserHandler);
usersRouter.delete('/', deleteUsersHandler);
usersRouter.delete('/:username', deleteUserHandler);

export default usersRouter;