import MongoStore = require('connect-mongo');
import {MONGO_DB_URL} from "../../utils/environment";

export const mongoSessionStore: MongoStore = MongoStore.create({
    mongoUrl: MONGO_DB_URL,
    collectionName: 'sessions',
});