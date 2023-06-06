import {authGuard} from "./auth-guard";
import {
    authenticate,
    authorizedStatus,
    login,
    logout,
    register
} from "./auth-request-handlers";
import {Router} from "express";

const authRouter = Router();
authRouter.post('/register/', register);
authRouter.post('/login/', authenticate, login);
authRouter.post('/logout/', authGuard, logout);
authRouter.get('/protected/', authGuard, authorizedStatus);

export default authRouter;