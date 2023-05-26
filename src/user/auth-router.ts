import {User} from "./user.type";
import {registerUser$, userExists$} from "./mongo-users";
import {RequestHandler, Request, Response} from "express";
import {authGuard} from "./auth-guard";
import {
   BAD_REQUEST,
   CONFLICT,
   CREATED,
   INTERNAL_SERVER_ERROR,
} from "../utils/http-status-constants";
const express = require('express');
import passport = require("passport");
const authenticateUserMiddleware = passport.authenticate('local');

const register: RequestHandler = (req: Request, res: Response): void => {
   if (!req.body.username) {
      res.status(BAD_REQUEST).json('Username required.');
      return;
   }

   if (!req.body.password) {
      res.status(BAD_REQUEST).json('Password required.');
      return;
   }

   userExists$(req.body.username).subscribe((userExists: boolean): void => {
      if (userExists) {
         res.status(CONFLICT).json('Username taken.');
         return;
      }

      registerUser$(req.body.username, req.body.password).subscribe((user): void => {
         res.status(CREATED).json(`New user, ${req.body.username}, created.`);
      });
   });
};

const login: RequestHandler = (req: Request, res: Response): void => {
   res.json(`Logged in as ${(req.user as User).username}`);
};

const logout: RequestHandler = (req: Request, res: Response): void => {
   req.logout((error) => {
       if (error) {
          res.status(INTERNAL_SERVER_ERROR)
              .json('Log out failed.');
          return;
       }

       res.json('Logged out successfuly.');
   });
};

const authenticate: RequestHandler = (req: Request, res: Response): void =>
   res.json(`Authenticated as ${(req.user as User).username}`);

const authRouter = express.Router();

authRouter.post('/register/', register);
authRouter.post('/login/', authenticateUserMiddleware, login);
authRouter.post('/logout/', authGuard, logout);
authRouter.get('/protected/', authGuard, authenticate);

export default authRouter;