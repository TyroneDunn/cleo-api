import session = require("express-session");
import {SessionOptions} from "express-session";
import {NODE_ENV, SESSION_SECRET} from "../environment";
import {mongoSessionStore} from "./mongo-session-store-config";

const httpOnly: boolean = (NODE_ENV === 'production');

const options: SessionOptions = {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: mongoSessionStore,
    cookie: {
        // Session Lifespan: 21 Days.
        maxAge: 21 * (24 * (60 * ( 1000 * 60 ))),
        httpOnly: httpOnly,
    },
};

export const sessionMiddleware = session(options);