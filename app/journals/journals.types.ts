import { OrderOption, Page, Timestamps, User } from '@hals/common';

export type Journal = {
    _id: string,
    name: string,
    author: string,
    createdAt: Date,
    updatedAt: Date,
};

export type GetJournalRequest = {
    user : User,
    id : string,
};

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
    sortBy : JournalsSortOptions,
    order : OrderOption
};

export type JournalsSortOptions =
   | 'id'
   | 'name'
   | 'createdAt'
   | 'updatedAt';

export type CreateJournalRequest = {
    user : User,
    author : string,
    name : string,
};

export type UpdateJournalRequest = {
    user : User,
    id : string,
    name? : string,
};

export type DeleteJournalRequest = {
    user : User,
    id : string,
};

export type DeleteJournalsRequest = {
    user : User,
    filter : JournalsFilter,
};
