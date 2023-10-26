import {Application, RequestHandler} from "express";
const express = require("express");
import {corsOptions} from "./cors-config";
const cors = require('cors');
import {sessionMiddleware} from "./session-config";
import passport = require("passport");
require("../modules/user/passport-config");
import journalsRouter from "../modules/journal/journals-router";
import entriesRouter from "../modules/entry/entries-router";
import {API_PORT, API_TITLE} from "../environment";
import usersRouter from "../modules/user/users-router";
import {authGuard} from "../modules/user/users-request-handlers";

const cleoHomeRoute = (req, res): RequestHandler =>
    res.send(API_TITLE);

const app: Application = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', cleoHomeRoute);
app.use('/users/', usersRouter);
app.use('/journals/', authGuard, journalsRouter);
app.use('/entries/', authGuard, entriesRouter);

export const run = (): void => {
    app.listen(API_PORT, () => {
        console.log(`${API_TITLE} \n\tport: ${API_PORT}`);
    });
};