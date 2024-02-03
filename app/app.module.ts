import {Application as ExpressApplication, RequestHandler} from "express";
const express = require("express");
import corsOptions from "./cors.config";
const cors = require('cors');
import {sessionMiddleware} from "./session-config";
import passport = require("passport");
require("./auth/passport-config");
import { API_PORT, API_TITLE, API_VERSION, NODE_ENV } from "./environment";
import entriesRouter from './entry/entries-router';
import usersRouter from './user/users-router';
import authRouter from './auth/auth-router';
import { authGuard } from './auth/auth-request-handlers';

import {hals} from '@hals/core';
import { Application, ApplicationSchema, LOCAL_HOST, NodeEnvironmentOption } from '@hals/common';
import authStrategy from './auth-strategy.config';
import journalsController from './journals/journals.module';


const cleoHomeRoute = (req, res): RequestHandler =>
    res.send(API_TITLE);

const expressApp: ExpressApplication = express();
expressApp.use(express.json());
expressApp.use(cors(corsOptions));
expressApp.use(sessionMiddleware);
expressApp.use(passport.initialize());
expressApp.use(passport.session());

expressApp.get('/', cleoHomeRoute);
expressApp.use('/auth/', authRouter);
expressApp.use('/users/', authGuard, usersRouter);
expressApp.use('/entries/', authGuard, entriesRouter);

export const run = (): void => {
    expressApp.listen(API_PORT, () => {
        console.log(`${API_TITLE} \n\tport: ${API_PORT}`);
    });
};

const appSchema: ApplicationSchema = {
    nodeEnv: NODE_ENV as NodeEnvironmentOption,
    serverOption: "Express",
    title: API_TITLE,
    version: API_VERSION,
    host: LOCAL_HOST,
    port: API_PORT,
    corsOptions: corsOptions,
    authStrategy: authStrategy,
    controllers: [
       journalsController,
    ],
};

const app: Application = hals(appSchema);

export default app;