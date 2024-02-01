import { MongoJournalsRepository } from './journal/mongo-journals-repository';
import { JournalsRepository } from './journal/journals-repository';
import { EntriesRepository } from './entry/entries-repository';
import { MongoEntriesRepository } from './entry/mongo-entries-repository';
import { UsersRepository } from './user/users-repository';
import { MongoUsersRepository } from './user/mongo-users-repository';

export const USERS_REPOSITORY: UsersRepository = MongoUsersRepository;
export const JOURNALS_REPOSITORY: JournalsRepository = MongoJournalsRepository;
export const ENTRIES_REPOSITORY: EntriesRepository = MongoEntriesRepository;