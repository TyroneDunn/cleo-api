import { CommandResult, Error } from '@hals/common';
import { UpdateUserRequest, UserMetadata } from './users.types';

export type UsersMetadataRepository = {
   getUserMetadata: (username: string) => Promise<UserMetadata | Error>,
   updateUserMetadata: (request : UpdateUserRequest) => Promise<CommandResult | Error>,
   deleteUserMetadata: (username: string) => Promise<CommandResult | Error>,
   userIsAdmin: (username: string) => Promise<boolean | Error>,
};
