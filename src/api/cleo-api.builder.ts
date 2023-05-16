import {CleoAPI} from "./cleo-api";
import {API_PORT} from "../utils/environment";
import {corsOptions} from "./cors/cors-config";
import {sessionMiddleware} from "./session/session-config";
import {MongooseUserRepository} from "./user/mongoose-user-repository";
import {MongooseJournalRepository} from "./journal/mongoose-journal-repository";
import {MongooseJournalEntryRepository} from "./journal-entry/mongoose-journal-entry-repository";

export function buildCleoApi() {
    return new CleoAPI(
        API_PORT || 5011,
        sessionMiddleware,
        corsOptions,
        new MongooseUserRepository(),
        new MongooseJournalRepository(),
        new MongooseJournalEntryRepository(),
    );
}