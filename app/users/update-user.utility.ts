import { UsersRepository } from './users-repository.type';
import { UsersMetadataRepository } from './users-metadata-repository.type';
import { CommandResult, Error, isError, User } from '@hals/common';
import { UpdateUserRequest } from './users.types';

export type UpdateUserUtility = {
   updateUsername : (request : UpdateUserRequest) => Promise<CommandResult | Error>,
   updatePassword : (request : UpdateUserRequest) => Promise<CommandResult | Error>,
   updatePrivileges : (request : UpdateUserRequest) => Promise<CommandResult | Error>,
   updateStatus : (request : UpdateUserRequest) => Promise<CommandResult | Error>,
};

export const UpdateUserUtility = (
   usersRepository : UsersRepository,
   usersMetadataRepository : UsersMetadataRepository,
) : UpdateUserUtility => ({
   updateUsername  : async (request : UpdateUserRequest) : Promise<CommandResult | Error> => {
      const result : User | Error = await usersRepository.updateUser(request);
      if (isError(result)) return CommandResult(false, 0);
      else return CommandResult(true, 1);
   },

   updatePassword  : async (request : UpdateUserRequest) : Promise<CommandResult | Error> => {
      const result : User | Error = await usersRepository.updateUser(request);
      if (isError(result)) return CommandResult(false, 0);
      else return CommandResult(true, 1);
   },

   updateStatus    : async (request : UpdateUserRequest) : Promise<CommandResult | Error> => {
      const result : CommandResult | Error = await usersMetadataRepository.updateUserMetadata(request);
      if (isError(result)) return result;
      else return result;
   },

   updatePrivileges: async (request : UpdateUserRequest) : Promise<CommandResult | Error> => {
      const result : CommandResult | Error = await usersMetadataRepository.updateUserMetadata(request);
      if (isError(result)) return result;
      else return result;
   },
});
