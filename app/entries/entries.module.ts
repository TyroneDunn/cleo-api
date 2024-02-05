import { EntriesController } from './entries.controller';
import { Controller } from '@hals/common';
import { EntriesService } from './entries.service';
import { MongoEntriesRepository } from './mongo-entries-repository.service';
import { EntriesValidator } from './entries.validator';
import { MongoUsersRepository } from '../user/mongo-users-repository';
import { MongoJournalsRepository } from '../journals/mongo-journals-repository.service';

const entriesService : EntriesService = EntriesService(
   MongoEntriesRepository,
   EntriesValidator(
      MongoUsersRepository,
      MongoJournalsRepository,
      MongoEntriesRepository
   ));
const entriesController : Controller = EntriesController(entriesService);

export default entriesController;