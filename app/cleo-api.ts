import {Application, RequestHandler} from "express";
const express = require("express");
import corsOptions from "./cors.config";
const cors = require('cors');
import {sessionMiddleware} from "./session-config";
import passport = require("passport");
require("./auth/passport-config");
import { API_PORT, API_TITLE, API_VERSION, NODE_ENV } from "./environment";
import journalsRouter from './journal/journals-router';
import entriesRouter from './entry/entries-router';
import usersRouter from './user/users-router';
import authRouter from './auth/auth-router';
import { authGuard } from './auth/auth-request-handlers';

import {hals} from '@hals/core';
import { ApplicationSchema, NodeEnvironmentOption } from '@hals/common';
import authStrategy from './auth-strategy.config';


const cleoHomeRoute = (req, res): RequestHandler =>
    res.send(API_TITLE);

const app: Application = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', cleoHomeRoute);
app.use('/auth/', authRouter);
app.use('/users/', authGuard, usersRouter);
app.use('/journals/', authGuard, journalsRouter);
app.use('/entries/', authGuard, entriesRouter);

export const run = (): void => {
    app.listen(API_PORT, () => {
        console.log(`${API_TITLE} \n\tport: ${API_PORT}`);
    });
};

const appSchema: ApplicationSchema = {
    nodeEnv: NODE_ENV as NodeEnvironmentOption,
    serverOption: "Express",
    title: API_TITLE,
    version: API_VERSION,
    host: '127.0.0.1',
    port: API_PORT,
    corsOptions: corsOptions,
    authStrategy: authStrategy,
    controllers: [
    ],
};