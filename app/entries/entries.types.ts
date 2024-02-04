import { OrderOption } from '@hals/common';

export type Entry = {
    _id: string,
    title: string,
    body: string,
    journal: any,
    lastUpdated: Date,
    dateCreated: Date,
};

export type EntriesSortOption =
   | 'id'
   | 'journal'
   | 'title'
   | 'body'
   | 'dateCreated'
   | 'lastUpdated';

export type GetEntryRequest = { id : string };

export type GetEntriesRequest = {
    title? : string,
    titleRegex? : string,
    body? : string,
    bodyRegex? : string,
    journal? : string,
    startDate? : string,
    endDate? : string,
    sort? : EntriesSortOption,
    order? : OrderOption,
    page? : number,
    limit? : number,
};

export type CreateEntryRequest = {
    journal : string,
    title : string,
    body : string,
};

export type UpdateEntryRequest = {
    id : string,
    title? : string,
    body? : string,
    journal? : string,
};
export type DeleteEntryRequest = { id : string };

export type DeleteEntriesRequest = {
    title? : string,
    titleRegex? : string,
    body? : string,
    bodyRegex? : string,
    journal? : string,
    startDate? : string,
    endDate? : string,
};
