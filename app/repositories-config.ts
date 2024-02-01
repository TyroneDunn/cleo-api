import { MongoJournalsRepository } from './journals/mongo-journals-repository.service';
import { JournalsRepository } from './journals/journals-repository.type';
import { EntriesRepository } from './entry/entries-repository';
import { MongoEntriesRepository } from './entry/mongo-entries-repository';
import { UsersRepository } from './user/users-repository';
import { MongoUsersRepository } from './user/mongo-users-repository';

export const USERS_REPOSITORY: UsersRepository = MongoUsersRepository;
export const JOURNALS_REPOSITORY: JournalsRepository = MongoJournalsRepository;
export const ENTRIES_REPOSITORY: EntriesRepository = MongoEntriesRepository;