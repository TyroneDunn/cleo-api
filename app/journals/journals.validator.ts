import { JournalsRepository } from "./journals-repository.type";
import {
   CreateJournalRequest,
   DeleteJournalRequest,
   DeleteJournalsRequest,
   GetJournalRequest,
   GetJournalsRequest,
   UpdateJournalRequest,
} from './journals.types';
import { ValidationError } from '@hals/common';
import { UsersMetadataRepository } from '../users/users-metadata-repository.type';

export type JournalsValidator = {
   validateGetJournalRequest : (request : GetJournalRequest) => Promise<ValidationError | null>,
   validateGetJournalsRequest : (request : GetJournalsRequest) => Promise<ValidationError | null>,
   validateCreateJournalRequest : (request : CreateJournalRequest) => Promise<ValidationError | null>,
   validateUpdateJournalRequest : (request : UpdateJournalRequest) => Promise<ValidationError | null>,
   validateDeleteJournalRequest : (request : DeleteJournalRequest) => Promise<ValidationError | null>,
   validateDeleteJournalsRequest : (request : DeleteJournalsRequest) => Promise<ValidationError | null>,
};

export const JournalsValidator = (
   journalsRepository : JournalsRepository,
   usersMetadataRepository : UsersMetadataRepository
) : JournalsValidator => ({
   validateGetJournalRequest : async (request : GetJournalRequest) : Promise<ValidationError | null> => {
      if (!request.user)
         return ValidationError('Unauthorized', 'Unauthorized user.');
      if (!request.id)
         return ValidationError('BadRequest', 'Journal ID required.');
      if (!(await journalsRepository.exists(request.id)))
         return ValidationError('NotFound', `Journal ${request.id} not found.`);
      if (!(await journalsRepository.ownsJournal(request.user.username, request.id)) && !(await usersMetadataRepository.isAdmin(request.user.username)))
         return ValidationError('Forbidden', 'Insufficient permissions.');
      return null;
   },

   validateGetJournalsRequest : async (request : GetJournalsRequest): Promise<ValidationError | null> => {
      if (!request.user)
         return ValidationError('Unauthorized', 'Unauthorized user.');
      if (!(await usersMetadataRepository.isAdmin(request.user.username)) && (request.filter.author || request.filter.authorRegex))
         return ValidationError('Forbidden', 'Insufficient permissions.');
      if (request.filter) {
         if (request.filter.name && request.filter.nameRegex)
            return ValidationError('BadRequest', 'Invalid query. Provide either "name" or "nameRegex".');
         if (request.filter.author && request.filter.authorRegex)
            return ValidationError('BadRequest', 'Invalid query. Provide either "author" or "authorRegex"');
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
            && request.sort.sortBy !== 'name'
            && request.sort.sortBy !== 'updatedAt'
            && request.sort.sortBy !== 'createdAt')
            return ValidationError('BadRequest', 'Invalid sort query. Sort by option must be id, name,' +
               ' updatedAt, or createdAt.');
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

   validateCreateJournalRequest : async (request : CreateJournalRequest): Promise<ValidationError | null> => {
      if (!request.user)
         return ValidationError('Unauthorized', 'Unauthorized user.');
      if (!request.name)
         return ValidationError('BadRequest', 'Journal name required.');
      if (!request.author)
         return ValidationError('BadRequest', 'Journal author required.');
      return null;
   },

   validateUpdateJournalRequest : async (request : UpdateJournalRequest): Promise<ValidationError | null> => {
      if (!request.user)
         return ValidationError('Unauthorized', 'Unauthorized user.');
      if (!request.id)
         return ValidationError('BadRequest', 'Journal ID required.');
      if (!request.name)
         return ValidationError('BadRequest', 'Journal name required.');
      if (!(await journalsRepository.ownsJournal(request.user.username, request.id)) && !(await usersMetadataRepository.isAdmin(request.user.username)))
         return ValidationError('Forbidden', 'Insufficient permissions.');
      if (!(await journalsRepository.exists(request.id)))
         return ValidationError('NotFound', `Journal ${request.id} not found.`);
      return null;
   },

   validateDeleteJournalRequest : async (request : DeleteJournalRequest): Promise<ValidationError | null> => {
      if (!request.user)
         return ValidationError('Unauthorized', 'Unauthorized user.');
      if (!request.id)
         return ValidationError('BadRequest', 'Journal ID required.');
      if (!(await journalsRepository.ownsJournal(request.user.username, request.id)) && !(await usersMetadataRepository.isAdmin(request.user.username)))
         return ValidationError('Forbidden', 'Insufficient permissions.');
      if (!(await journalsRepository.exists(request.id)))
         return ValidationError('NotFound', `Journal ${request.id} not found.`);
      return null;
   },

   validateDeleteJournalsRequest : async (request : DeleteJournalsRequest): Promise<ValidationError | null> => {
      if (!request.user)
         return ValidationError('Unauthorized', 'Unauthorized user.');
      if (!(await usersMetadataRepository.isAdmin(request.user.username)) && (request.filter.author || request.filter.authorRegex))
         return ValidationError('Forbidden', 'Insufficient permissions.');
      if (request.filter.name && request.filter.nameRegex)
         return ValidationError('BadRequest', 'Invalid query. Provide either "name" or "nameRegex".');
      if (request.filter.author && request.filter.authorRegex)
         return ValidationError('BadRequest', 'Invalid query. Provide either "author" or "authorRegex"');
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
      return null;
   },
});
