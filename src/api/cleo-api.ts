import {API_TITLE, HTTP_STATUS_UNAUTHORIZED} from "../utils/environment";
import {Application, RequestHandler} from "express";
import {AuthRoute} from "./user/auth-route";
import {UserRepository} from "./user/user-repository.type";
import {JournalRoute} from "./journal/journal-route";
import {JournalRepository} from "./journal/journal-repository.type";
import {JournalEntriesRoute} from "./journal-entry/journal-entries-route";
import {JournalEntryRepository} from "./journal-entry/journal-entry-repository.type";
const express = require("express");
import passport = require("passport");
import {CorsOptions} from "cors";
require("./passport/passport-config");
const cors = require('cors');

export class CleoAPI {
    private readonly app: Application;
    private readonly authenticateUserMiddleware: RequestHandler = passport.authenticate('local');
    private readonly authGuard: RequestHandler = (req, res, next) => {
        if (req.isAuthenticated())
            next();
        else
            res.status(HTTP_STATUS_UNAUTHORIZED).json('Not logged in.');
    };
    private readonly authRouter: RequestHandler = new AuthRoute(this.userRepository, this.authenticateUserMiddleware, this.authGuard).router;
    private readonly journalsRouter: RequestHandler = new JournalRoute(this.journalRepository).router;
    private readonly journalEntriesRouter: RequestHandler = new JournalEntriesRoute(this.journalEntryRepository, this.journalRepository).router;
    public constructor(
        private port: number,
        private sessionMiddleware: RequestHandler,
        corsOptions: CorsOptions,
        private userRepository: UserRepository,
        private journalRepository: JournalRepository,
        private journalEntryRepository: JournalEntryRepository
    ) {
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors(corsOptions));
        this.app.use(sessionMiddleware);
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        this.app.get('/', this.homeRoute);
        this.app.use('/auth/', this.authRouter);
        this.app.use('/journals/', this.authGuard, this.journalsRouter);
        this.app.use('/journal-entries/', this.authGuard, this.journalEntriesRouter);
    };

    private homeRoute(req, res): RequestHandler {
        return res.send(API_TITLE || 'Cleo-Server:v.1.2.0');
    };

    public run() {
        this.app.listen(this.port, () => {
            console.log(`${API_TITLE} \n\tport: ${this.port}`);
        });
    };
}