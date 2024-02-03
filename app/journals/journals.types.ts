import { OrderOption, Page, Timestamps, User } from '@hals/common';

export type Journal = {
    _id: string,
    name: string,
    author: string,
    dateCreated: Date,
    lastUpdated: Date,
};

export type GetJournalRequest = { id : string };

export type GetJournalsRequest = {
    user : User,
    filter? : JournalsFilter,
    sort? : JournalsSort,
    page? : Page
};

export type JournalsFilter =  {
    name? : string,
    nameRegex? : string,
    author? : string,
    authorRegex? : string,
    timestamps? : Timestamps
};

export type JournalsSort = {
    sortBy : JournalsSortOption,
    order : OrderOption
};

export type JournalsSortOption =
   | 'id'
   | 'name'
   | 'dateCreated'
   | 'lastUpdated';

export type CreateJournalRequest = {
    author : string,
    name : string,
};

export type UpdateJournalRequest = {
    id : string,
    name? : string,
};

export type DeleteJournalRequest = {
    id : string,
};

export type DeleteJournalsRequest = {
    name? : string,
    nameRegex? : string,
    author? : string,
    authorRegex? : string,
    startDate? : string,
    endDate? : string,
};
