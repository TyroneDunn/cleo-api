import { JournalsRepository } from "./journals-repository.type";
import { JournalsValidator } from "./journals.validator";
import { handleRequest, Request, RequestHandler, Response } from '@hals/common';
import {
   createJournalAndMapToResponse,
   deleteJournalAndMapToResponse,
   deleteJournalsAndMapToResponse,
   getJournalAndMapToResponse,
   getJournalsAndMapToResponse,
   mapRequestToCreateJournalRequest,
   mapRequestToDeleteJournalRequest,
   mapRequestToDeleteJournalsRequest,
   mapRequestToGetJournalRequest,
   mapRequestToGetJournalsRequest,
   mapRequestToUpdateJournalRequest,
   updateJournalAndMapToResponse,
} from './journals.utilities';

export type JournalsService = {
   getJournal : RequestHandler,
   getJournals : RequestHandler,
   createJournal : RequestHandler,
   updateJournal : RequestHandler,
   deleteJournal : RequestHandler,
   deleteJournals : RequestHandler,
};

export const JournalsService = (
   journalsRepository : JournalsRepository,
   validator : JournalsValidator,
) : JournalsService => ({
   getJournal: async (request : Request) : Promise<Response> => handleRequest(
      mapRequestToGetJournalRequest(request),
      validator.validateGetJournalRequest,
      getJournalAndMapToResponse(journalsRepository.getJournal),
   ),

   getJournals: async (request : Request) : Promise<Response> => handleRequest(
      mapRequestToGetJournalsRequest(request),
      validator.validateGetJournalsRequest,
      getJournalsAndMapToResponse(journalsRepository.getJournals),
   ),

   createJournal: async (request : Request) : Promise<Response> => handleRequest(
      mapRequestToCreateJournalRequest(request),
      validator.validateCreateJournalRequest,
      createJournalAndMapToResponse(journalsRepository.createJournal),
   ),

   updateJournal: async (request : Request) : Promise<Response> => handleRequest(
      mapRequestToUpdateJournalRequest(request),
      validator.validateUpdateJournalRequest,
      updateJournalAndMapToResponse(journalsRepository.updateJournal),
   ),

   deleteJournal : async (request : Request) : Promise<Response> => handleRequest(
      mapRequestToDeleteJournalRequest(request),
      validator.validateDeleteJournalRequest,
      deleteJournalAndMapToResponse(journalsRepository.deleteJournal),
   ),
   deleteJournals: async (request : Request) : Promise<Response> => handleRequest(
      mapRequestToDeleteJournalsRequest(request),
      validator.validateDeleteJournalsRequest,
      deleteJournalsAndMapToResponse(journalsRepository.deleteJournals),
   ),
});
