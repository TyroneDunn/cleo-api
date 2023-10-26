import {Router} from "express";
import {
    authenticate,
    authenticatedResponse,
    authGuard,
    loggedInResponse,
    logout,
    register,
    registerAdmin
} from "./auth-request-handlers";

const authRouter: Router = Router();

authRouter.post('/login/', authenticate, loggedInResponse);
authRouter.post('/logout/', authGuard, logout);
authRouter.post('/register/', register, authenticate, loggedInResponse);
authRouter.post('/register-admin/', registerAdmin);
authRouter.get('/protected/', authGuard, authenticatedResponse);

export default authRouter;
