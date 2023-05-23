import {
   BAD_REQUEST,
   CONFLICT,
   CREATED,
   INTERNAL_SERVER_ERROR,
   OK
} from "../utils/http-status-constants";
const express = require('express');
import {RequestHandler} from "express";
import {UserRepository} from "./user-repository.type";
import {User} from "./user.type";

export class AuthRoute {
   public readonly router = express.Router();

   constructor(
       private userRepository: UserRepository,
       authenticateUserMiddleware: RequestHandler,
       authGuard: RequestHandler
   ) {
      this.router.post('/register/', this.register);
      this.router.post('/login/', authenticateUserMiddleware, this.login);
      this.router.post('/logout/', authGuard, this.logout);
      this.router.get('/protected/', authGuard, this.protected);
   }

   private register = async (req, res) => {
      const username = req.body.username;
      const password = req.body.password;

      if (!username) {
         res.status(BAD_REQUEST).json('Username requirel.');
         return;
      }

      if (!password) {
         res.status(BAD_REQUEST).json('Password required.');
         return;
      }

      this.userRepository.userExists$(username).subscribe((userExists) => {
         if (userExists) {
            res.status(CONFLICT).json(`Username already taken.`);
            return;
         }

         this.userRepository.registerUser$(username, password).subscribe((user) => {
            res.status(CREATED).json(user);
         });
      });
   }

   private login: RequestHandler = (req, res) => {
      res.status(OK).json(`Logged in as ${(req.user as User).username}`);
   }

   private logout = (req, res) => {
      req.logout(
          (error) => {
         if (error) {
            res.status(INTERNAL_SERVER_ERROR)
                .json('Log out failed.');
            return;
         }

         res.json('Logged out successfully.');
      });
   };

   private protected = (req, res) => {
      res.json(`Authenticated as ${(req.user as User).username}`);
   };
}