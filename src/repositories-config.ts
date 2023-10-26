import {MongoJournalsRepository} from "./modules/journal/mongo-journals-repository";
import {JournalsRepository} from "./modules/journal/journals-repository";
import {EntriesRepository} from "./modules/entry/entries-repository";
import {MongoEntriesRepository} from "./modules/entry/mongo-entries-repository";
import {UsersRepository} from "./modules/user/users-repository";
import {MongoUsersRepository} from "./modules/user/mongo-users-repository";

export const USERS_REPOSITORY: UsersRepository = MongoUsersRepository;
export const JOURNALS_REPOSITORY: JournalsRepository = MongoJournalsRepository;
export const ENTRIES_REPOSITORY: EntriesRepository = MongoEntriesRepository;