import {
    GetUserRequest,
    GetUsersRequest,
    UpdateUserRequest,
} from "./users.types";
import { ValidationError, Error, isError } from '@hals/common';
import { UsersRepository } from './users-repository.type';
import { UsersMetadataRepository } from './users-metadata-repository.type';

export type UsersValidator = {
    validateGetUserRequest : (request : GetUserRequest) => Promise<ValidationError | null>,
    validateGetUsersRequest : (request : GetUsersRequest) => Promise<ValidationError | null>,
    validateUpdateUserRequest : (request : UpdateUserRequest) => Promise<ValidationError | null>,
};

export const UsersValidator = (
   usersRepository : UsersRepository,
   usersMetadataRepository : UsersMetadataRepository
) : UsersValidator => ({
    validateGetUserRequest : async (request : GetUserRequest) : Promise<ValidationError | null> => {
        if (!(request.user))
            return ValidationError('Unauthorized', 'Unauthorized user.');
        const isAdmin: boolean | Error = await usersMetadataRepository.isAdmin(request.user.username);
        if (isError(isAdmin))
            return ValidationError('Internal', 'Error processing user privileges.');
        if (isAdmin === false)
            return ValidationError('Forbidden', 'Insufficient permissions.');
        if (!request.username)
            return ValidationError('BadRequest', 'Username required.');
        if (!(await usersRepository.exists(request.username)))
            return ValidationError('NotFound', `User ${request.username} not found.`);
        return null;
    },

    validateGetUsersRequest : async (request : GetUsersRequest) : Promise<ValidationError | null> => {
        if (!(request.user))
            return ValidationError('Unauthorized', 'Unauthorized user.');
        const isAdmin: boolean | Error = await usersMetadataRepository.isAdmin(request.user.username);
        if (isError(isAdmin))
            return ValidationError('Internal', 'Error processing user privileges.');
        if (isAdmin === false)
            return ValidationError('Forbidden', 'Insufficient permissions.');
        if (request.filter) {
            if (request.filter.username && request.filter.usernameRegex)
                return ValidationError('BadRequest', 'Invalid query. Provide either "name" or "nameRegex".');

            if (request.filter.privilege) {
                for (const query of request.filter.privilege) {
                    if (query !== 'admin'
                    && query !== 'superuser')
                        return ValidationError('BadRequest', 'Invalid privilege query. Privilege' +
                           ' options are "admin" and "superuser".');
                }
            }
            if (request.filter.status) {
                for (const query of request.filter.status) {
                    if (query !== 'active'
                       && query !== 'suspended'
                       && query !== 'inactive')
                        return ValidationError('BadRequest', 'Invalid status query. Status' +
                           ' options are "active", "inactive" and "suspended".');
                }
            }
            if (request.filter.timestamps) {
                if (request.filter.timestamps.createdAt) {
                    if (request.filter.timestamps.createdAt.start) {
                        if (isNaN(Date.parse(request.filter.timestamps.createdAt.start)))
                            return ValidationError('BadRequest', 'Invalid created at start date query.' +
                               ' Provide a ISO date string.');
                    }
                    if (request.filter.timestamps.createdAt.end) {
                        if (isNaN(Date.parse(request.filter.timestamps.createdAt.end)))
                            return ValidationError('BadRequest', 'Invalid created at end date query.' +
                               ' Provide a ISO date string.');
                    }
                }
                if (request.filter.timestamps.updatedAt) {
                    if (request.filter.timestamps.updatedAt.start) {
                        if (isNaN(Date.parse(request.filter.timestamps.updatedAt.start)))
                            return ValidationError('BadRequest', 'Invalid updated at start date query.' +
                               ' Provide a ISO date string.');
                    }
                    if (request.filter.timestamps.updatedAt.end) {
                        if (isNaN(Date.parse(request.filter.timestamps.updatedAt.end)))
                            return ValidationError('BadRequest', 'Invalid updated at end date query.' +
                               ' Provide a ISO date string.');
                    }
                }
            }
        }

        if (request.sort) {
            if (request.sort.sortBy && !request.sort.order)
                return ValidationError("BadRequest", 'Invalid sort query. Provide sort order.');
            if (!request.sort.sortBy && request.sort.order)
                return ValidationError("BadRequest", 'Invalid sort query. Provide sort by field.');
            if (request.sort.sortBy !== 'id'
               && request.sort.sortBy !== 'username'
               && request.sort.sortBy !== 'updatedAt'
               && request.sort.sortBy !== 'createdAt')
                return ValidationError('BadRequest', 'Invalid sort query. Sort by option must be' +
                   ' id, username, updatedAt, or createdAt.');
            if ((request.sort.order !== 'asc' && request.sort.order !== 'desc'))
                return ValidationError('BadRequest', 'Invalid sort query. Order must be "asc" or "desc".');
        }

        if (request.page === undefined)
            return ValidationError('BadRequest', 'Invalid query. Page index and limit required.');
        if (request.page.index < 0)
            return ValidationError('BadRequest', 'Invalid query. Page index must be 0 or greater.');
        if (request.page.limit < 1)
            return ValidationError('BadRequest', 'Invalid query. Page limit must be greater than 0.');

        return null;
    },

    validateUpdateUserRequest : async (request : UpdateUserRequest) : Promise<ValidationError | null> => {
        if (!(request.user))
            return ValidationError('Unauthorized', 'Unauthorized user.');
        const isAdmin: boolean | Error = await usersMetadataRepository.isAdmin(request.user.username);
        if (isError(isAdmin))
            return ValidationError('Internal', 'Error processing user privileges.');
        if (isAdmin === false)
            return ValidationError('Forbidden', 'Insufficient permissions.');
        if (!(await usersRepository.exists(request.username)))
            return ValidationError('NotFound', `User ${request.username} not found.`);

        if (!request.updateFields)
            return ValidationError('BadRequest', 'Invalid query. Update fields required.');

        if (request.updateFields.username) {
            if (request.updateFields.username.length < 3)
                return ValidationError('BadRequest', 'Username must be at least 3 characters.');

            if (await usersRepository.exists(request.username))
                return ValidationError('Conflict', 'Username already taken.');
        }

        if (request.updateFields.password) {
            if (request.updateFields.password.length < 8)
                return ValidationError('BadRequest', 'Password must be at least 8 characters.');
        }

        if (request.updateFields.privilege) {
            if (!(await usersMetadataRepository.isAdmin(request.user.username)))
                return ValidationError('Forbidden', 'Insufficient permissions.');
            for (const query of request.updateFields.privilege) {
                if (query !== 'admin'
                   && query !== 'superuser')
                    return ValidationError('BadRequest', 'Invalid privilege query. Privilege' +
                       ' options are "admin" and "superuser".');
            }
        }

        if (request.updateFields.status) {
            if (!(await usersMetadataRepository.isAdmin(request.user.username)))
                return ValidationError('Forbidden', 'Insufficient permissions.');
            for (const query of request.updateFields.status) {
                if (query !== 'active'
                   && query !== 'suspended'
                   && query !== 'inactive')
                    return ValidationError('BadRequest', 'Invalid status query. Status' +
                       ' options are "active", "inactive" and "suspended".');
            }
        }

        return null;
    }
});
