import {API_TITLE} from "../utils/environment";
import {Application, RequestHandler} from "express";
import {AuthRoute} from "../user/auth-route";
import {UserRepository} from "../user/user-repository.type";
import journalsRouter from "../journal/journals-router";
import journalEntriesRouter from "../journal-entry/journal-entries-router";
const express = require("express");
import passport = require("passport");
import {CorsOptions} from "cors";
require("./passport/passport-config");
const cors = require('cors');
import authGuard from '../user/auth-guard';

export class CleoAPI {
    private app: Application;
    private readonly authenticateUserMiddleware: RequestHandler;
    private readonly authRouter: RequestHandler;
    private readonly authGuard = authGuard
    public constructor(
        private readonly port: number,
        private readonly sessionMiddleware: RequestHandler,
        corsOptions: CorsOptions,
        private readonly userRepository: UserRepository,
    ) {
        this.authenticateUserMiddleware = passport.authenticate('local');
        this.authRouter =
            new AuthRoute(
                this.userRepository,
                this.authenticateUserMiddleware,
                this.authGuard
            ).router;
        
        this.configureServerApplication(corsOptions);
    };

    private configureServerApplication(corsOptions) {
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors(corsOptions));
        this.app.use(this.sessionMiddleware);
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.configureRoutes();
    }

    private configureRoutes() {
        this.app.get('/', this.homeRouter);
        this.app.use('/auth/', this.authRouter);
        this.app.use('/journals/', this.authGuard, journalsRouter);
        this.app.use('/entries/', this.authGuard, journalEntriesRouter);
    }

    private homeRouter(req, res): RequestHandler {
        return res.send(API_TITLE || 'Cleo-Server:v.1.2.0');
    };

    public run() {
        this.app.listen(this.port, () => {
            console.log(`${API_TITLE} \n\tport: ${this.port}`);
        });
    };
}