import {
   HTTP_STATUS_BAD_REQUEST,
   HTTP_STATUS_CONFLICT,
   HTTP_STATUS_CREATED,
   HTTP_STATUS_INTERNAL_SERVER_ERROR,
   HTTP_STATUS_OK
} from "../../utils/environment";
const express = require('express');
import {RequestHandler} from "express";
import {UserRepository} from "./user-repository.type";
import {User} from "./user.type";

export class AuthRoute {
   public readonly router = express.Router();

   constructor(private userRepository: UserRepository, authenticateUserMiddleware: RequestHandler, authGuard: RequestHandler) {
      this.router.post('/register/', this.register);
      this.router.post('/login/', authenticateUserMiddleware, this.login);
      this.router.post('/logout/', authGuard, this.logout);
      this.router.get('/protected/', authGuard, this.protected);
   }

   private register = async (req, res) => {
      const username = req.body.username;
      const password = req.body.password;

      if (!username) {
         res.status(HTTP_STATUS_BAD_REQUEST).json(`Username required.`);
         return;
      }

      if (!password) {
         res.status(HTTP_STATUS_BAD_REQUEST).json(`Password required.`);
         return;
      }

      if (await this.userRepository.userExists(username)) {
         res.status(HTTP_STATUS_CONFLICT).json(`Username already taken.`);
         return;
      }

      await this.userRepository.registerUser(username, password);
      res.status(HTTP_STATUS_CREATED).json(`New user created.`);
   }

   private login: RequestHandler = (req, res) => {
      res.status(HTTP_STATUS_OK).json(`Logged in as ${(req.user as User).username}`);
   }

   private logout = (req, res) => {
      req.logout(error => {
         if (error) {
            res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json(`Log out failed.`);
            return;
         }

         res.status(HTTP_STATUS_OK).json(`Logged out successfully.`);
      });
   };

   private protected = (req, res) => {
      res.status(HTTP_STATUS_OK).json(`Authenticated as ${(req.user as User).username}`);
   };
}