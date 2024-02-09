import { UsersValidator } from "./users.validator";
import { UsersRepository } from "./users-repository.type";
import { handleRequest, Request, RequestHandler, Response, User } from '@hals/common';
import { UsersMetadataRepository } from './users-metadata-repository.type';
import {
    getUserAndMapToResponse,
    getUsersAndMapToResponse,
    mapRequestToGetUserRequest,
    mapRequestToGetUsersRequest,
    mapRequestToUpdateUserRequest,
    updateUserAndMapToResponse,
} from './users.utilities';
import { UpdateUserUtility } from './update-user.utility';
import { halsEventEmitter, UserRegisteredEvent } from '@hals/core';
import { CreateUserMetadataRequest } from './users.types';

export type UsersService = {
    init : () => void,
    getUser : RequestHandler,
    getUsers : RequestHandler,
    updateUser : RequestHandler,
};

export const UsersService = (
   usersRepository : UsersRepository,
   usersMetadataRepository : UsersMetadataRepository,
   validator : UsersValidator,
) : UsersService => ({
    init: () : void => {
        halsEventEmitter.on(
           UserRegisteredEvent,
           async (user : User): Promise<void> => {
               const createUserMetadataRequest : CreateUserMetadataRequest = {
                   user: user,
                   privileges: [],
                   status: 'active'
               };
               await usersMetadataRepository.createUserMetadata(createUserMetadataRequest);
           }
        );
    },

    getUser : async (request : Request) : Promise<Response> => handleRequest(
       mapRequestToGetUserRequest(request),
       validator.validateGetUserRequest,
       getUserAndMapToResponse(usersRepository.getUser)
    ),

    getUsers : async (request : Request) : Promise<Response> => handleRequest(
       mapRequestToGetUsersRequest(request),
       validator.validateGetUsersRequest,
       getUsersAndMapToResponse(usersRepository.getUsers)
    ),

    updateUser: async (request: Request) : Promise<Response> => handleRequest(
       mapRequestToUpdateUserRequest(request),
       validator.validateUpdateUserRequest,
       updateUserAndMapToResponse(UpdateUserUtility(usersRepository, usersMetadataRepository))
    ),
});
