import corsOptions from "./cors.config";
import { API_PORT, API_TITLE, API_VERSION, NODE_ENV } from "./environment";
import {hals} from '@hals/core';
import { Application, ApplicationSchema, LOCAL_HOST, NodeEnvironmentOption } from '@hals/common';
import authStrategy from './auth-strategy.config';
import journalsController from './journals/journals.module';
import entriesController from './entries/entries.module';
import usersController from './users/users.module';

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
       usersController,
       journalsController,
       entriesController,
    ],
};

const app: Application = hals(appSchema);

export default app;
