import { MongoJournalsRepository } from './journals/mongo-journals-repository.service';
import { JournalsRepository } from './journals/journals-repository.type';
import { EntriesRepository } from './entries/entries-repository.type';
import { MongoEntriesRepository } from './entries/mongo-entries-repository.service';
import { UsersRepository } from './users/users-repository.type';
import { MongoUsersRepository } from './users/mongo-users-repository.service';

export const USERS_REPOSITORY: UsersRepository = MongoUsersRepository;
export const JOURNALS_REPOSITORY: JournalsRepository = MongoJournalsRepository;
export const ENTRIES_REPOSITORY: EntriesRepository = MongoEntriesRepository;