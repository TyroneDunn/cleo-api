import { EntriesController } from './entries.controller';
import { Controller } from '@hals/common';
import { EntriesService } from './entries.service';
import { MongoEntriesRepository } from './mongo-entries-repository.service';
import { EntriesValidator } from './entries.validator';
import { MongoJournalsRepository } from '../journals/mongo-journals-repository.service';
import { MongoUsersMetadataRepository } from '../users/mongo-users-metadata-repository.service';

const entriesService : EntriesService = EntriesService(
   MongoEntriesRepository,
   EntriesValidator(
      MongoUsersMetadataRepository,
      MongoJournalsRepository,
      MongoEntriesRepository
   ));
const entriesController : Controller = EntriesController(entriesService);

export default entriesController;