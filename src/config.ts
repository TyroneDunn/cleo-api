import {MongoJournalsRepository} from "./journal/mongo-journals-repository";
import {JournalsRepository} from "./journal/journals-repository";
import {EntriesRepository} from "./entry/entries-repository";
import {MongoEntriesRepository} from "./entry/mongo-entries-repository";

export const JOURNALS_REPOSITORY: JournalsRepository = MongoJournalsRepository;
export const ENTRIES_REPOSITORY: EntriesRepository = MongoEntriesRepository;
