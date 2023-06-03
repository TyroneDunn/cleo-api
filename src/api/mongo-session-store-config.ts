import MongoStore = require('connect-mongo');
import {MONGODB_URL} from "../environment";

export const mongoSessionStore: MongoStore = MongoStore.create({
    mongoUrl: MONGODB_URL,
    collectionName: 'sessions',
});