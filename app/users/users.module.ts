import { Controller } from '@hals/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongoUsersRepository } from './mongo-users-repository.service';
import { UsersValidator } from './users.validator';
import { MongoUsersMetadataRepository } from './mongo-users-metadata-repository.service';

const usersService : UsersService = UsersService(
   MongoUsersRepository,
   MongoUsersMetadataRepository,
   UsersValidator(MongoUsersRepository, MongoUsersMetadataRepository));
const usersController : Controller = UsersController(usersService);

export default usersController;
