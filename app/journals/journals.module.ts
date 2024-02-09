import { JournalsService } from './journals.service';
import { MongoJournalsRepository } from './mongo-journals-repository.service';
import { JournalsValidator } from './journals.validator';
import { Controller } from '@hals/common';
import { JournalsController } from './journals.controller';
import { MongoUsersMetadataRepository } from '../users/mongo-users-metadata-repository.service';

const journalsService : JournalsService = JournalsService(
   MongoJournalsRepository,
   JournalsValidator(MongoJournalsRepository, MongoUsersMetadataRepository)
);
const journalsController : Controller = JournalsController(journalsService);

export default journalsController;