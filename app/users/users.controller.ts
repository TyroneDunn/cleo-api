import { Controller, Method, RequestHandler } from '@hals/common';
import { UsersService } from './users.service';
import { logGetRequest, logPatchRequest } from '../shared/log.utility';

export const UsersController = (service : UsersService) : Controller => ({
   path    : 'users/',
   guard   : true,
   methods : [
      getUsersMethod(service.getUsers),
      getUserMethod(service.getUser),
      updateUserMethod(service.updateUser),
   ],
});

const getUsersMethod = (getUsers : RequestHandler) : Method => ({
   type           : "GET",
   queryParamKeys : UsersQueryParamKeys,
   sideEffects    : [ logGetRequest("Get Users") ],
   requestHandler : getUsers,
});

const getUserMethod = (getUser : RequestHandler) : Method => ({
   type           : "GET",
   paramKeys      : [ ID ],
   sideEffects    : [ logGetRequest("Get User") ],
   requestHandler : getUser,
});

const updateUserMethod = (updateUser : RequestHandler) : Method => ({
   type           : "PATCH",
   paramKeys      : [ ID ],
   sideEffects    : [ logPatchRequest("Patch User") ],
   requestHandler : updateUser,
});

const ID : string = 'id';

const UsersQueryParamKeys : string[] = [
   'username',
   'id',
   'createdAt',
   'updatedAt',
   'sortBy',
   'order',
   'index',
   'limit',
];
