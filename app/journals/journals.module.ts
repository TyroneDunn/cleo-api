import { JournalsService } from './journals.service';
import { MongoJournalsRepository } from './mongo-journals-repository.service';
import { MongoUsersRepository } from '../user/mongo-users-repository';
import { JournalsValidator } from './journals.validator';
import { Controller } from '@hals/common';
import { JournalsController } from './journals.controller';

const journalsService : JournalsService = JournalsService(
   MongoJournalsRepository,
   JournalsValidator(MongoJournalsRepository, MongoUsersRepository)
);
const journalsController : Controller = JournalsController(journalsService);

export default journalsController;