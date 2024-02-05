import { EntriesRepository } from "./entries-repository.type";
import { EntriesValidator } from "./entries.validator";
import { handleRequest, Request, RequestHandler, Response } from '@hals/common';
import {
    createEntryAndMapToResponse,
    deleteEntriesAndMapToResponse,
    deleteEntryAndMapToResponse,
    getEntriesAndMapToResponse,
    getEntryAndMapToResponse,
    mapRequestToCreateEntryRequest,
    mapRequestToDeleteEntriesRequest,
    mapRequestToDeleteEntryRequest,
    mapRequestToGetEntriesRequest,
    mapRequestToGetEntryRequest,
    mapRequestToUpdateEntryRequest,
    updateEntryAndMapToResponse,
} from './entries.utilities';

export type EntriesService = {
    getEntry : RequestHandler,
    getEntries : RequestHandler,
    createEntry : RequestHandler,
    updateEntry : RequestHandler,
    deleteEntry : RequestHandler,
    deleteEntries : RequestHandler,
};

export const EntriesService = (
   entriesRepository : EntriesRepository,
   validator : EntriesValidator
) : EntriesService => ({
    getEntry: async (request : Request) : Promise<Response> => handleRequest(
       mapRequestToGetEntryRequest(request),
       validator.validateGetEntryRequest,
       getEntryAndMapToResponse(entriesRepository.getEntry),
    ),

    getEntries: (request : Request) : Promise<Response> => handleRequest(
       mapRequestToGetEntriesRequest(request),
       validator.validateGetEntriesRequest,
       getEntriesAndMapToResponse(entriesRepository.getEntries),
    ),

    createEntry: (request : Request) : Promise<Response> => handleRequest(
       mapRequestToCreateEntryRequest(request),
       validator.validateCreateEntryRequest,
       createEntryAndMapToResponse(entriesRepository.createEntry)
    ),

    updateEntry: (request : Request) : Promise<Response> => handleRequest(
       mapRequestToUpdateEntryRequest(request),
       validator.validateUpdateEntryRequest,
       updateEntryAndMapToResponse(entriesRepository.updateEntry)
    ),

    deleteEntry: (request : Request) : Promise<Response> => handleRequest(
       mapRequestToDeleteEntryRequest(request),
       validator.validateDeleteEntryRequest,
       deleteEntryAndMapToResponse(entriesRepository.deleteEntry)
    ),

    deleteEntries: (request : Request) : Promise<Response> => handleRequest(
       mapRequestToDeleteEntriesRequest(request),
       validator.validateDeleteEntriesRequest,
       deleteEntriesAndMapToResponse(entriesRepository.deleteEntries)
    ),
});
