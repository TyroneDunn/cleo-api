import {API_TITLE} from "../utils/environment";
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
import authGuard from './user/auth-guard'

export class CleoAPI {
    private readonly app: Application;
    private readonly authenticateUserMiddleware: RequestHandler;
    private readonly authRouter: RequestHandler;
    private readonly authGuard = authGuard
    private readonly journalsRouter: RequestHandler;
    private readonly journalEntriesRouter: RequestHandler;
    public constructor(
        private readonly port: number,
        private readonly sessionMiddleware: RequestHandler,
        corsOptions: CorsOptions,
        private readonly userRepository: UserRepository,
        private readonly journalRepository: JournalRepository,
        private readonly journalEntryRepository: JournalEntryRepository
    ) {
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors(corsOptions));
        this.app.use(sessionMiddleware);
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        this.authenticateUserMiddleware = passport.authenticate('local')
        this.authRouter = new AuthRoute(
            this.userRepository,
            this.authenticateUserMiddleware,
            this.authGuard)
            .router;
        this.journalsRouter = new JournalRoute(this.journalRepository).router;
        this.journalEntriesRouter = 
            new JournalEntriesRoute(this.journalEntryRepository, this.journalRepository)
                .router;

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