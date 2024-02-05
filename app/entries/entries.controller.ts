import { EntriesService } from './entries.service';
import { Controller, Method, RequestHandler } from '@hals/common';
import {
   logCreateRequest,
   logDeleteRequest,
   logGetRequest,
   logPatchRequest,
} from '../logs/log.utility';

export const EntriesController = (service : EntriesService) : Controller => ({
   path    : 'entries/',
   guard   : true,
   methods : [
      getEntriesMethod(service.getEntries),
      getEntryMethod(service.getEntry),
      createEntryMethod(service.createEntry),
      updateEntryMethod(service.updateEntry),
      deleteEntriesMethod(service.deleteEntries),
      deleteEntryMethod(service.deleteEntry),
   ],
});

const getEntriesMethod = (getEntries : RequestHandler) : Method => ({
   type           : "GET",
   queryParamKeys : EntriesQueryParamKeys,
   sideEffects    : [ logGetRequest("Get Entries") ],
   requestHandler : getEntries,
});

const getEntryMethod = (getEntry : RequestHandler) : Method => ({
   type           : "GET",
   paramKeys      : [ ID ],
   sideEffects    : [ logGetRequest("Get Entry") ],
   requestHandler : getEntry,
});

const createEntryMethod = (createEntry : RequestHandler) : Method => ({
   type           : "POST",
   sideEffects    : [ logCreateRequest("Create Entry") ],
   requestHandler : createEntry,
});

const updateEntryMethod = (updateEntry : RequestHandler) : Method => ({
   type           : "PATCH",
   paramKeys      : [ ID ],
   sideEffects    : [ logPatchRequest("Patch Entry") ],
   requestHandler : updateEntry,
});

const deleteEntriesMethod = (deleteEntries : RequestHandler) : Method => ({
   type           : "DELETE",
   queryParamKeys : EntriesQueryParamKeys,
   sideEffects    : [ logDeleteRequest("Delete Entries") ],
   requestHandler : deleteEntries,
});

const deleteEntryMethod = (deleteEntry : RequestHandler) : Method => ({
   type           : "DELETE",
   paramKeys      : [ ID ],
   sideEffects    : [ logDeleteRequest("Delete Entry") ],
   requestHandler : deleteEntry,
});

const ID : string = 'id';

const EntriesQueryParamKeys : string[] = [
   'title',
   'titleRegex',
   'body',
   'bodyRegex',
   'journal',
   'createdAt',
   'updatedAt',
   'sortBy',
   'order',
   'index',
   'limit',
];
