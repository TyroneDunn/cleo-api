import { Controller, Method, RequestHandler } from '@hals/common';
import {
   logCreateRequest,
   logDeleteRequest,
   logGetRequest,
   logPatchRequest,
} from '../logs/log.utility';
import { JournalsService } from './journals.service';

export const JournalsController = (service : JournalsService) : Controller => ({
   path    : 'journals/',
   guard   : true,
   methods : [
      getJournalsMethod(service.getJournals),
      getJournalMethod(service.getJournal),
      createJournalMethod(service.createJournal),
      updateJournalMethod(service.updateJournal),
      deleteJournalsMethod(service.deleteJournals),
      deleteJournalMethod(service.deleteJournal),
   ],
});

const getJournalsMethod = (getJournals : RequestHandler) : Method => ({
   type           : "GET",
   queryParamKeys : JournalsQueryParamKeys,
   sideEffects    : [ logGetRequest("Get Journals") ],
   requestHandler : getJournals,
});

const getJournalMethod = (getJournal : RequestHandler) : Method => ({
   type           : "GET",
   paramKeys      : [ ID ],
   sideEffects    : [ logGetRequest("Get Journal") ],
   requestHandler : getJournal,
});

const createJournalMethod = (createJournal : RequestHandler) : Method => ({
   type           : "POST",
   sideEffects    : [ logCreateRequest("Create Journal") ],
   requestHandler : createJournal,
});

const updateJournalMethod = (updateJournal : RequestHandler) : Method => ({
   type           : "PATCH",
   paramKeys      : [ ID ],
   sideEffects    : [ logPatchRequest("Patch Journal") ],
   requestHandler : updateJournal,
});

const deleteJournalsMethod = (deleteJournals : RequestHandler) : Method => ({
   type           : "DELETE",
   queryParamKeys : JournalsQueryParamKeys,
   sideEffects    : [ logDeleteRequest("Delete Journals") ],
   requestHandler : deleteJournals,
});

const deleteJournalMethod = (deleteJournal : RequestHandler) : Method => ({
   type           : "DELETE",
   paramKeys      : [ ID ],
   sideEffects    : [ logDeleteRequest("Delete Journal") ],
   requestHandler : deleteJournal,
});

const ID : string = 'id';

const JournalsQueryParamKeys : string[] = [
   'name',
   'nameRegex',
   'author',
   'authorRegex',
   'createdAt',
   'updatedAt',
   'sortBy',
   'order',
   'index',
   'limit',
];
