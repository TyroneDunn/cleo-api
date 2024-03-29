import {JournalsRepository} from "../journals/journals-repository.type";
import {EntriesRepository} from "./entries-repository.type";
import {
    CreateEntryRequest,
    DeleteEntriesRequest,
    DeleteEntryRequest,
    GetEntriesRequest, GetEntryRequest,
    UpdateEntryRequest,
} from './entries.types';
import { Error, isError, ValidationError } from '@hals/common';
import { UsersMetadataRepository } from '../users/users-metadata-repository.type';
import {ObjectId} from "mongodb";

export type EntriesValidator = {
    validateGetEntryRequest : (request : GetEntryRequest) => Promise<ValidationError | null>,
    validateGetEntriesRequest : (request : GetEntriesRequest) => Promise<ValidationError | null>,
    validateCreateEntryRequest : (request : CreateEntryRequest) => Promise<ValidationError | null>,
    validateUpdateEntryRequest : (request : UpdateEntryRequest) => Promise<ValidationError | null>,
    validateDeleteEntryRequest : (request : DeleteEntryRequest) => Promise<ValidationError | null>,
    validateDeleteEntriesRequest : (request : DeleteEntriesRequest) => Promise<ValidationError | null>,
};

export const EntriesValidator = (
   usersMetadataRepository: UsersMetadataRepository,
   journalsRepository: JournalsRepository,
   entriesRepository: EntriesRepository,
) : EntriesValidator => ({
    validateGetEntryRequest : async (request : GetEntryRequest) : Promise<ValidationError | null> => {
        if (!request.user)
            return ValidationError('Unauthorized', 'Unauthorized users.');
        if (!request.id)
            return ValidationError('BadRequest', 'Entry ID required.');
        if (!ObjectId.isValid(request.id))
            return ValidationError('BadRequest', 'Invalid entry ID.');
        if (!(await entriesRepository.exists(request.id)))
            return ValidationError('NotFound', `Entry ${request.id} not found.`);
        const isAdmin: boolean | Error = await usersMetadataRepository.isAdmin(request.user.username);
        if (isError(isAdmin))
            return ValidationError('Internal', 'Error processing user privileges.');
        if (!isAdmin && !(await entriesRepository.ownsEntry(request.user.username, request.id)))
            return ValidationError('Forbidden', 'Insufficient permissions.');
        return null;
    },

    validateGetEntriesRequest : async (request : GetEntriesRequest) : Promise<ValidationError | null> => {
        if (!request.user)
            return ValidationError('Unauthorized', 'Unauthorized users.');
        if (request.filter) {
            if (request.filter.journal) {
                if (!(await journalsRepository.exists(request.filter.journal)))
                    return ValidationError('NotFound', `Journal ${request.filter.journal} not found.`);
                if (!(await usersMetadataRepository.isAdmin(request.user.username)) && !(await journalsRepository.ownsJournal(request.user.username, request.filter.journal)))
                    return ValidationError('Forbidden', 'Insufficient permissions.');
                if (!ObjectId.isValid(request.filter.journal))
                    return ValidationError('BadRequest', 'Invalid journal ID.');
            }
            if ((request.filter.title && request.filter.titleRegex))
                return ValidationError('BadRequest', 'Invalid query. Provide either "title" or' +
                   ' "titleRegex".')
            if ((request.filter.body && request.filter.bodyRegex))
                return ValidationError('BadRequest', 'Invalid query. Provide either "body" or "bodyRegex".')
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
               && request.sort.sortBy !== 'title'
               && request.sort.sortBy !== 'body'
               && request.sort.sortBy !== 'journal'
               && request.sort.sortBy !== 'updatedAt'
               && request.sort.sortBy !== 'createdAt')
                return ValidationError('BadRequest', 'Invalid query. Sort option must' +
                   ' be id, title, body, journal, updatedAt, or createdAt.');
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

    validateCreateEntryRequest : async (request : CreateEntryRequest) : Promise<ValidationError | null> => {
        if (!request.user)
            return ValidationError('Unauthorized', 'Unauthorized users.');
        if (!request.journal)
            return ValidationError('BadRequest', 'Journal required.');
        if (!ObjectId.isValid(request.journal))
            return ValidationError('BadRequest', 'Invalid journal ID.');
        if (!(await journalsRepository.exists(request.journal)))
            return ValidationError('NotFound', `Journal ${request.journal} not found.`);
        const isAdmin: boolean | Error = await usersMetadataRepository.isAdmin(request.user.username);
        if (isError(isAdmin))
            return ValidationError('Internal', 'Error processing user privileges.');
        if (!isAdmin && !(await journalsRepository.ownsJournal(request.user.username, request.journal)))
            return ValidationError('Forbidden', 'Insufficient permissions.');
        return null;
    },

    validateUpdateEntryRequest : async (request : UpdateEntryRequest) : Promise<ValidationError | null> => {
        if (!request.user)
            return ValidationError('Unauthorized', 'Unauthorized users.');
        if (!request.id)
            return ValidationError('BadRequest', 'Entry ID required.');
        if (!ObjectId.isValid(request.id))
            return ValidationError('BadRequest', 'Invalid entry ID.');
        const isAdmin: boolean | Error = await usersMetadataRepository.isAdmin(request.user.username);
        if (isError(isAdmin))
            return ValidationError('Internal', 'Error processing user privileges.');
        if (!isAdmin && !(await entriesRepository.ownsEntry(request.user.username, request.id)))
            return ValidationError('Forbidden', 'Insufficient permissions.');
        if (!(await entriesRepository.exists(request.id)))
            return ValidationError('NotFound', `Entry ${request.id} not found.`);
        if ((!request.body) && (!request.journal) && (!request.title))
            return ValidationError('BadRequest', 'Entry update field required.');
        if (request.journal) {
            if (!(await journalsRepository.exists(request.journal)))
                return ValidationError('NotFound', `Journal ${request.journal} not found.`);
        }
        return null;
    },

    validateDeleteEntryRequest : async (request : DeleteEntryRequest) : Promise<ValidationError | null> => {
        if (!request.user)
            return ValidationError('Unauthorized', 'Unauthorized users.');
        if (!request.id)
            return ValidationError('BadRequest', 'Entry ID required.');
        if (!ObjectId.isValid(request.id))
            return ValidationError('BadRequest', 'Invalid entry ID.');
        if (!(await entriesRepository.exists(request.id)))
            return ValidationError('NotFound', `Entry ${request.id} not found.`);
        if (!(await usersMetadataRepository.isAdmin(request.user.username)) && !(await entriesRepository.ownsEntry(request.user.username, request.id)))
            return ValidationError('Forbidden', 'Insufficient permissions.');
        return null;
    },

    validateDeleteEntriesRequest : async (request : DeleteEntriesRequest) : Promise<ValidationError | null> => {
        if (!request.user)
            return ValidationError('Unauthorized', 'Unauthorized users.');
        if (request.filter) {
            if (request.filter.journal) {
                if (!(await journalsRepository.exists(request.filter.journal)))
                    return ValidationError('NotFound', `Journal ${request.filter.journal} not found.`);
                if (!(await usersMetadataRepository.isAdmin(request.user.username)) && !(await journalsRepository.ownsJournal(request.user.username, request.filter.journal)))
                    return ValidationError('Forbidden', 'Insufficient permissions.');
                if (!ObjectId.isValid(request.filter.journal))
                    return ValidationError('BadRequest', 'Invalid journal ID.');
            }
            if ((request.filter.title && request.filter.titleRegex))
                return ValidationError('BadRequest', 'Invalid query. Provide either "title" or' +
                   ' "titleRegex".')
            if ((request.filter.body && request.filter.bodyRegex))
                return ValidationError('BadRequest', 'Invalid query. Provide either "body" or "bodyRegex".')
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
        return null;
    },
});
