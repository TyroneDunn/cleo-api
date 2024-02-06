import {
   CommandResult,
   DateRange,
   Error,
   isError,
   mapErrorToInternalServerErrorResponse,
   mapRequestToPage,
   OK,
   Request,
   Response,
   User,
} from '@hals/common';
import {
   GetUserRequest,
   GetUsersRequest,
   UpdateUserRequest,
   UserPrivilegeOptions,
   UserSortOption,
   UserStatusOption,
} from './users.types';
import { GetUser, GetUsers } from './users-repository.type';
import { OrderOption } from '../utils/order-option';
import { GetRecordsResponse } from '../shared/get-records-response.type';

import { UpdateUserUtility } from './update-user.utility';

export const mapRequestToGetUserRequest = (request : Request) : GetUserRequest => ({
   user : request.user,
   username : request.paramMap['username']
});

export const getUserAndMapToResponse = (getUser : GetUser) : Response =>
   async (request : GetUserRequest) : Promise<Response> => {
      const result : User | Error = await getUser(request);
      if (isError(result)) return mapErrorToInternalServerErrorResponse(result);
      else return mapUserToSuccessResponse(result);
   };

const mapUserToSuccessResponse = (user : User) : Response => ({
   status     : OK,
   collection : [ user ],
   count      : 1,
});

export const mapRequestToGetUsersRequest = (request : Request) : GetUsersRequest => ({
   user : request.user,
   ... mapRequestToUsersFilter(request),
   ... mapRequestToUsersSort(request),
   ... mapRequestToPage(request),
});

const mapRequestToUsersFilter = (request : Request) => ({
   filter : {
      ...request.queryParamMap['username'] && { name: request.queryParamMap['username'] },
      ...request.queryParamMap['usernameRegex'] && { nameRegex: request.queryParamMap['usernameRegex'] },
      ...request.queryParamMap['privilege'] && { privilege: JSON.parse(request.queryParamMap['privilege']) as UserPrivilegeOptions[] },
      ...request.queryParamMap['status'] && { status: JSON.parse(request.queryParamMap['status']) as UserStatusOption[] },
      ...(request.queryParamMap['createdAt'] && !request.queryParamMap['updatedAt']) && {
         timestamps: {
            createdAt: (JSON.parse(request.queryParamMap['createdAt']) as DateRange),
         },
      },
      ...(request.queryParamMap['updatedAt'] && !request.queryParamMap['createdAt']) && {
         timestamps: {
            updatedAt: (JSON.parse(request.queryParamMap['updatedAt']) as DateRange),
         },
      },
      ...(request.queryParamMap['createdAt'] && request.queryParamMap['updatedAt']) && {
         timestamps: {
            createdAt: (JSON.parse(request.queryParamMap['createdAt']) as DateRange),
            updatedAt: (JSON.parse(request.queryParamMap['updatedAt']) as DateRange),
         },
      },
   }
});

const mapRequestToUsersSort = (request : Request) => ({
   ...(request.queryParamMap['sortBy'] && request.queryParamMap['order']) && {
      sortBy: {
         field: request.queryParamMap['sortBy'] as UserSortOption,
         order: request.queryParamMap['order'] as OrderOption,
      },
   },
});

export const getUsersAndMapToResponse = (getUsers : GetUsers) : Response =>
   async (request : GetUsersRequest) => {
      const result : GetRecordsResponse<User> | Error = await getUsers(request);
      if (isError(result)) return mapErrorToInternalServerErrorResponse(result);
      else return mapUsersToSuccessResponse(result);
   };

const mapUsersToSuccessResponse = (users : GetRecordsResponse<User>) : Response => ({
   status     : OK,
   collection : [ users.collection ],
   count      : users.count,
});

export const mapRequestToUpdateUserRequest = (request : Request) : UpdateUserRequest => ({
   user : request.user,
   username : request.paramMap['username'],
   updateFields : {
      ... request.payload['username'] && { username : request.payload['username'] },
      ... request.payload['password'] && { password : request.payload['password'] },
      ... request.payload['privilege'] && { privilege : JSON.parse(request.payload['privilege']) as UserPrivilegeOptions[] },
      ... request.payload['status'] && { status : JSON.parse(request.payload['status']) as UserStatusOption[] },
   }
});

export const updateUserAndMapToResponse = (userUpdateUtility : UpdateUserUtility) : Response =>
   async (request : UpdateUserRequest) : Promise<Response> => {
      if (request.updateFields.username) {
         const updateUsernameResult : CommandResult | Error = await userUpdateUtility.updateUsername(request);
         if (isError(updateUsernameResult)) return mapErrorToInternalServerErrorResponse(updateUsernameResult);
      }
      if (request.updateFields.password) {
         const updatePasswordResult : CommandResult | Error = await userUpdateUtility.updatePassword(request);
         if (isError(updatePasswordResult)) return mapErrorToInternalServerErrorResponse(updatePasswordResult);
      }
      if (request.updateFields.privilege) {
         const updatePrivilegeResult : CommandResult | Error = await userUpdateUtility.updatePrivileges(request);
         if (isError(updatePrivilegeResult)) return mapErrorToInternalServerErrorResponse(updatePrivilegeResult);
      }
      if (request.updateFields.status) {
         const updateStatusResult : CommandResult | Error = await userUpdateUtility.updateStatus(request);
         if (isError(updateStatusResult)) return mapErrorToInternalServerErrorResponse(updateStatusResult);
      }
      return okResponse;
   };

const okResponse : Response = {
   status     : OK,
};
