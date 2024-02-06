import { UsersValidator } from "./users.validator";
import { UsersRepository } from "./users-repository.type";
import { handleRequest, Request, RequestHandler, Response } from '@hals/common';
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

export type UsersService = {
    getUser : RequestHandler,
    getUsers : RequestHandler,
    updateUser : RequestHandler,
};

export const UsersService = (
   usersRepository : UsersRepository,
   usersMetadataRepository : UsersMetadataRepository,
   validator : UsersValidator,
) : UsersService => ({
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
