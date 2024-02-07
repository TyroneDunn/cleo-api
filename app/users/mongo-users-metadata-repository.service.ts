import { UsersMetadataRepository } from './users-metadata-repository.type';
import { CommandResult, Error } from '@hals/common';
import { UpdateUserRequest, UserMetadata, UserUpdateFields } from './users.types';
import UsersMetadataModel from './mongo-users-metadata-model.type';
import { DeleteResult } from 'mongodb';

export const MongoUsersMetadataRepository : UsersMetadataRepository = {
   getUserMetadata: async (username : string) : Promise<UserMetadata | Error> => {
      try {
         const metadata : UserMetadata | null = await UsersMetadataModel.findOne({ username: username });
         if (!metadata) return Error('NotFound', `User ${username} metadata not found.`);
         else return metadata;
      }
      catch (error) {
         return Error("Internal", (error as Error).message);
      }
   },

   updateUserMetadata : async (request : UpdateUserRequest) : Promise<CommandResult | Error> => {
      try {
         const query = mapToUpdateUserMetadataQuery(request.updateFields);
         return UsersMetadataModel.findOneAndUpdate(
            { username: request.username },
            query,
            { new: true }
         );
      }
      catch (error) {
         return Error("Internal", (error as Error).message);
      }
   },

   deleteUserMetadata : async (username : string) : Promise<CommandResult | Error> => {
      try {
         const result: DeleteResult = await UsersMetadataModel.deleteOne({ username: username });
         return CommandResult(result.acknowledged, result.deletedCount);
      }
      catch (error) {
         return Error("Internal", (error as Error).message);
      }
   },

   isAdmin: async (username : string) : Promise<boolean | Error> => {
      try {
         const userMetadata: UserMetadata | null = await UsersMetadataModel.findOne({username: username});
         if (!userMetadata) return Error("NotFound", 'User metadata not found.');
         return userMetadata.privileges.includes('admin');
      }
      catch (error) {
         return Error("Internal", (error as Error).message);
      }
   }
};

const mapToUpdateUserMetadataQuery = (updateFields : UserUpdateFields) => ({
   ... updateFields.privilege && { privileges: updateFields.privilege },
   ... updateFields.status && { status: updateFields.status },
});
