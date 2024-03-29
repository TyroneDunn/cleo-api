import {
   CommandResult,
   CREATED,
   DateRange,
   Error,
   isError,
   mapErrorToInternalServerErrorResponse,
   mapRequestToPage,
   OK, OrderOption,
   Request,
   Response,
} from '@hals/common';
import {
   CreateJournalRequest,
   DeleteJournalRequest,
   DeleteJournalsRequest,
   GetJournalRequest,
   GetJournalsRequest,
   Journal,
   JournalsSortOptions,
   UpdateJournalRequest,
} from './journals.types';
import {
   CreateJournal,
   DeleteJournal,
   DeleteJournals,
   GetJournal,
   GetJournals,
   UpdateJournal,
} from './journals-repository.type';
import { GetRecordsResponse } from '../shared/get-records-response.type';
import { mapDeleteResultToResponse } from '../shared/map-delete-result-to-response.utility';

export const mapRequestToGetJournalRequest = (request : Request) : GetJournalRequest => ({
   user : request.user,
   id   : request.paramMap['id'],
});

export const getJournalAndMapToResponse = (getJournal : GetJournal) : Response =>
   async (request : GetJournalRequest) : Promise<Response> => {
      const result : Journal | Error = await getJournal(request);
      if (isError(result)) return mapErrorToInternalServerErrorResponse(result);
      else return mapJournalToSuccessResponse(result);
   };

const mapJournalToSuccessResponse = (journal : Journal) : Response => ({
   status     : OK,
   collection : [ journal ],
   count      : 1,
});

export const mapRequestToGetJournalsRequest = (request : Request) : GetJournalsRequest => ({
   user: request.user,
   ... mapRequestToProductsFilter(request),
   ... mapRequestToProductsSort(request),
   ... mapRequestToPage(request),
});

const mapRequestToProductsFilter = (request : Request) => ({
   filter: {
      ...request.queryParamMap['name'] && { name: request.queryParamMap['name'] },
      ...request.queryParamMap['nameRegex'] && { nameRegex: request.queryParamMap['nameRegex'] },
      ...request.queryParamMap['author'] && { author: request.queryParamMap['author'] },
      ...request.queryParamMap['authorRegex'] && { authorRegex: request.queryParamMap['authorRegex'] },
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

const mapRequestToProductsSort = (request : Request) => ({
   ...(request.queryParamMap['sortBy'] && request.queryParamMap['order']) && {
      sortBy: {
         field: request.queryParamMap['sortBy'] as JournalsSortOptions,
         order: request.queryParamMap['order'] as OrderOption,
      },
   },
});

export const getJournalsAndMapToResponse = (getJournals : GetJournals) : Response =>
   async (request : GetJournalsRequest) : Promise<Response> => {
      const result : GetRecordsResponse<Journal> | Error = await getJournals(request);
      if (isError(result)) return mapErrorToInternalServerErrorResponse(result);
      else return mapJournalsToSuccessResponse(result);
   };

export const mapJournalsToSuccessResponse = (journals : GetRecordsResponse<Journal>) : Response => ({
   status     : OK,
   collection : journals.collection,
   count      : journals.count,
});

export const mapRequestToCreateJournalRequest = (request : Request) : CreateJournalRequest => ({
   user   : request.user,
   author : request.payload['author'],
   name   : request.payload['name'],
});

export const createJournalAndMapToResponse = (createJournal : CreateJournal) : Response =>
   async (request : CreateJournalRequest) : Promise<Response> => {
      const result : Journal | Error = await createJournal(request);
      if (isError(result)) return mapErrorToInternalServerErrorResponse(result);
      else return mapJournalToCreatedSuccessResponse(result);
   };

export const mapJournalToCreatedSuccessResponse = (journal : Journal) : Response => ({
   status     : CREATED,
   collection : [ journal ],
   count      : 1,
});

export const mapRequestToUpdateJournalRequest = (request : Request) : UpdateJournalRequest => ({
   user : request.user,
   id   : request.paramMap['id'],
   name : request.payload['name']
});

export const updateJournalAndMapToResponse = (updateJournal : UpdateJournal) : Response =>
   async (request : UpdateJournalRequest) => {
      const result : Journal | Error = await updateJournal(request);
      if (isError(result)) return mapErrorToInternalServerErrorResponse(result);
      else return mapJournalToSuccessResponse(result);
   };

export const mapRequestToDeleteJournalRequest = (request : Request) : DeleteJournalRequest => ({
   user : request.user,
   id   : request.paramMap['id'],
});

export const deleteJournalAndMapToResponse = (deleteJournal : DeleteJournal) : Response =>
   async (request : DeleteJournalRequest) : Promise<Response> => {
      const result : CommandResult | Error = await deleteJournal(request);
      if (isError(result)) return mapErrorToInternalServerErrorResponse(result);
      else return mapDeleteResultToResponse(result);
   };

export const mapRequestToDeleteJournalsRequest = (request : Request) : DeleteJournalsRequest => ({
   user : request.user,
   ...mapRequestToProductsFilter(request)
});

export const deleteJournalsAndMapToResponse = (deleteJournals : DeleteJournals) : Response =>
   async (request : DeleteJournalsRequest) : Promise<Response> => {
      const result : CommandResult | Error = await deleteJournals(request);
      if (isError(result)) return mapErrorToInternalServerErrorResponse(result);
      else return mapDeleteResultToResponse(result);
   };
