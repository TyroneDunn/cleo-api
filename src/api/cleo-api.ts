import {Application, RequestHandler} from "express";
const express = require("express");
import {corsOptions} from "./cors/cors-config";
const cors = require('cors');
import {sessionMiddleware} from "./session/session-config";
import passport = require("passport");
require("./passport/passport-config");
import authRouter from "../user/auth-router";
import authGuard from "../user/auth-guard";
import journalsRouter from "../journal/journals-router";
import journalEntriesRouter from "../journal-entry/journal-entries-router";
import {API_TITLE} from "../utils/environment";

const cleoHomeRoute = (req, res): RequestHandler => {
    return res.send(API_TITLE || 'Cleo-Server:v.1.3.x');
};

const app: Application = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', cleoHomeRoute);
app.use('/auth/', authRouter);
app.use('/journals/', authGuard, journalsRouter);
app.use('/entries/', authGuard, journalEntriesRouter);

export const run = (port: number) => {
    app.listen(port, () => {
        console.log(`${API_TITLE} \n\tport: ${port}`);
    });
};