import {
   CommandResult,
   CREATED,
   DateRange,
   Error,
   isError,
   mapDeleteResultToResponse,
   mapErrorToInternalServerErrorResponse,
   mapRequestToPage,
   OK,
   Request,
   Response,
} from '@hals/common';
import {
   CreateEntryRequest,
   DeleteEntriesRequest,
   DeleteEntryRequest,
   EntriesSortOptions,
   Entry,
   GetEntriesRequest,
   GetEntryRequest,
   UpdateEntryRequest,
} from './entries.types';
import {
   CreateEntry,
   DeleteEntries,
   DeleteEntry,
   GetEntries,
   GetEntry,
   UpdateEntry,
} from './entries-repository.type';
import { OrderOption } from '../utils/order-option';
import { GetRecordsResponse } from '../shared/get-records-response.type';

export const mapRequestToGetEntryRequest = (request : Request) : GetEntryRequest => ({
   user : request.user,
   id : request.paramMap['id'],
});

export const getEntryAndMapToResponse = (getEntry : GetEntry) : Response =>
   async (request : GetEntryRequest) => {
      const result : Entry | Error = await getEntry(request);
      if (isError(result)) return mapErrorToInternalServerErrorResponse(result);
      else return mapEntryToSuccessResponse(result);
   };

const mapEntryToSuccessResponse = (entry : Entry) : Response => ({
   status     : OK,
   collection : [ entry ],
   count      : 1,
});

export const mapRequestToGetEntriesRequest = (request : Request) : GetEntriesRequest => ({
   user: request.user,
   ...mapRequestToEntriesFilter(request),
   ...mapRequestToEntriesSort(request),
   ...mapRequestToPage(request),
});

const mapRequestToEntriesFilter = (request : Request) => ({
   filter: {
      ...request.queryParamMap['title'] && { name: request.queryParamMap['title'] },
      ...request.queryParamMap['titleRegex'] && { nameRegex: request.queryParamMap['titleRegex'] },
      ...request.queryParamMap['body'] && { author: JSON.parse(request.queryParamMap['body']) },
      ...request.queryParamMap['bodyRegex'] && { authorRegex: request.queryParamMap['bodyRegex'] },
      ...request.queryParamMap['journal'] && { name: request.queryParamMap['journal'] },
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

const mapRequestToEntriesSort = (request : Request) => ({
   ...(request.queryParamMap['sortBy'] && request.queryParamMap['order']) && {
      sortBy: {
         field: request.queryParamMap['sortBy'] as EntriesSortOptions,
         order: request.queryParamMap['order'] as OrderOption,
      },
   },
});

export const getEntriesAndMapToResponse = (getEntries : GetEntries) : Response =>
   async (request : GetEntriesRequest) : Promise<Response> => {
      const result : GetRecordsResponse<Entry> | Error = await getEntries(request);
      if (isError(result)) return mapErrorToInternalServerErrorResponse(result);
      else return mapEntriesToSuccessResponse(result);
   };

export const mapEntriesToSuccessResponse = (entries : GetRecordsResponse<Entry>) : Response => ({
   status     : OK,
   collection : entries.collection,
   count      : entries.count,
});

export const mapRequestToCreateEntryRequest = (request : Request) : CreateEntryRequest => ({
   user    : request.user,
   journal : request.payload['journal'],
   title   : request.payload['title'],
   body    : request.payload['body'],
});

export const createEntryAndMapToResponse = (createEntry : CreateEntry) : Response =>
   async (request : CreateEntryRequest) : Promise<Response> => {
      const result : Entry | Error = await createEntry(request);
      if (isError(result)) return mapErrorToInternalServerErrorResponse(result);
      else return mapEntryToCreatedSuccessResponse(result);
   };

const mapEntryToCreatedSuccessResponse = (entry : Entry) : Response => ({
   status     : CREATED,
   collection : [ entry ],
   count      : 1,
});

export const mapRequestToUpdateEntryRequest = (request : Request) : UpdateEntryRequest => ({
   user: request.user,
   id: request.paramMap['id'],
   ...request.paramMap['journal'] && { id: request.paramMap['journal'] },
   ...request.paramMap['title'] && { id: request.paramMap['title'] },
   ...request.paramMap['body'] && { id: request.paramMap['body'] },
});

export const updateEntryAndMapToResponse = (updateEntry : UpdateEntry) : Response =>
   async (request : UpdateEntryRequest) : Promise<Response> => {
      const result : Entry | Error = await updateEntry(request);
      if (isError(result)) return mapErrorToInternalServerErrorResponse(result);
      else return mapEntryToSuccessResponse(result);
   };

export const mapRequestToDeleteEntryRequest = (request : Request) : DeleteEntryRequest => ({
   user: request.user,
   id: request.paramMap['id'],
});

export const deleteEntryAndMapToResponse = (deleteEntry : DeleteEntry) : Response =>
   async (request : DeleteEntryRequest): Promise<Response> => {
      const result : CommandResult | Error = await deleteEntry(request);
      if (isError(result)) return mapErrorToInternalServerErrorResponse(result);
      else return mapDeleteResultToResponse(result);
   };

export const mapRequestToDeleteEntriesRequest = (request : Request) : DeleteEntriesRequest => ({
   user: request.user,
   ... mapRequestToEntriesFilter(request)
});

export const deleteEntriesAndMapToResponse = (deleteEntries : DeleteEntries) : Response =>
   async (request : DeleteEntriesRequest) : Promise<Response> => {
      const result : CommandResult | Error = await deleteEntries(request);
      if (isError(result)) return mapErrorToInternalServerErrorResponse(result);
      else return mapDeleteResultToResponse(result);
   };
