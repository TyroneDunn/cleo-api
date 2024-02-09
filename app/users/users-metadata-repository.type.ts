import { CommandResult, Error } from '@hals/common';
import { CreateUserMetadataRequest, UpdateUserRequest, UserMetadata } from './users.types';

export type UsersMetadataRepository = {
   getUserMetadata: (username: string) => Promise<UserMetadata | Error>,
   createUserMetadata: (request : CreateUserMetadataRequest) => Promise<UserMetadata | Error>,
   updateUserMetadata: (request : UpdateUserRequest) => Promise<CommandResult | Error>,
   deleteUserMetadata: (username: string) => Promise<CommandResult | Error>,
   isAdmin: (username: string) => Promise<boolean | Error>,
};
