import { OrderOption, Page, Timestamps, User } from '@hals/common';

export type Entry = {
    _id: string,
    title: string,
    body: string,
    journal: any,
    updatedAt: Date,
    createdAt: Date,
};

export type GetEntryRequest = {
    user : User,
    id : string
};

export type GetEntriesRequest = {
    user : User,
    filter? : EntriesFilter,
    sort? : EntriesSort,
    page : Page,
};

export type EntriesFilter = {
    title? : string,
    titleRegex? : string,
    body? : string,
    bodyRegex? : string,
    journal? : string,
    timestamps? : Timestamps
};

export type EntriesSort = {
    sortBy : EntriesSortOptions,
    order : OrderOption,
}

export type EntriesSortOptions =
   | 'id'
   | 'journal'
   | 'title'
   | 'body'
   | 'createdAt'
   | 'updatedAt';

export type CreateEntryRequest = {
    user : User,
    journal : string,
    title : string,
    body : string,
};

export type UpdateEntryRequest = {
    user : User,
    id : string,
    title? : string,
    body? : string,
    journal? : string,
};

export type DeleteEntryRequest = {
    user : User,
    id : string
};

export type DeleteEntriesRequest = {
    user : User,
    filter : EntriesFilter,
};
