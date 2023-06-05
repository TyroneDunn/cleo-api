import {User} from "../user/user";
import {Request, RequestHandler, Response} from "express";
import {authGuard} from "./auth-guard";
import {CREATED, INTERNAL_SERVER_ERROR,} from "../utils/http-status-constants";
import {registerUser} from "../user/users-service";
import {RegisterUserDTO} from "../user/users-dtos";
import {sendErrorResponse} from "../utils/send-error-response";

const express = require('express');
import passport = require("passport");
const authenticateUserMiddleware = passport.authenticate('local');

const mapToRegisterUserDTO = (req: Request): RegisterUserDTO => ({
   username: req.body.username,
   password: req.body.password,
});

const register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
   try {
      const dto: RegisterUserDTO = mapToRegisterUserDTO(req);
      const user = await registerUser(dto);
      res.status(CREATED).json(user);
   } catch (error) {
      sendErrorResponse(error, res);
   }
};

const login: RequestHandler = (req: Request, res: Response): void => {
   res.json(`Logged in as ${(req.user as User).username}`);
};

const logout: RequestHandler = (req: Request, res: Response): void => {
   req.logout((error) => {
       if (error) {
          res.status(INTERNAL_SERVER_ERROR).json('Log out failed.');
          return;
       }
       res.json('Logged out successfully.');
   });
};

const authorizedStatus: RequestHandler = (req: Request, res: Response): void => {
   res.json(`Authenticated as ${(req.user as User).username}`);
}

const authRouter = express.Router();
authRouter.post('/register/', register);
authRouter.post('/login/', authenticateUserMiddleware, login);
authRouter.post('/logout/', authGuard, logout);
authRouter.get('/protected/', authGuard, authorizedStatus);

export default authRouter;