import {Router} from "express";
import {getUser, getUsers, deleteUser, updateUser} from "./users-request-handlers";

const usersRouter: Router = Router();
usersRouter.get('/:id', getUser);
usersRouter.get('/', getUsers);
usersRouter.delete('/:id', deleteUser);
usersRouter.patch('/:id', updateUser);

export default usersRouter;