import {Router} from "express";
import {
    getUserHandler,
    getUsersHandler,
    deleteUserHandler,
    updateUserHandler,
    authenticate,
    loggedInResponse,
    authenticatedResponse,
    logout,
    register,
    authGuard,
    registerAdmin,
    updateUsersHandler,
    deleteUsersHandler,
} from "./users-request-handlers";

const usersRouter: Router = Router();
usersRouter.post('/login/', authenticate, loggedInResponse);
usersRouter.post('/logout/', authGuard, logout);
usersRouter.post('/register/', register);
usersRouter.post('/register-admin/', registerAdmin);
usersRouter.get('/protected/', authGuard, authenticatedResponse);

usersRouter.get('/', getUsersHandler);
usersRouter.get('/:username', getUserHandler);
usersRouter.patch('/', updateUsersHandler);
usersRouter.patch('/:username', updateUserHandler);
usersRouter.delete('/', deleteUsersHandler);
usersRouter.delete('/:username', deleteUserHandler);

export default usersRouter;