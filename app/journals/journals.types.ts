import { OrderOption } from '@hals/common';

export type Journal = {
    _id: string,
    name: string,
    author: string,
    dateCreated: Date,
    lastUpdated: Date,
};

export type GetJournalRequest = { id : string };

export type GetJournalsRequest = {
    name? : string,
    nameRegex? : string,
    author? : string,
    authorRegex? : string,
    startDate? : string,
    endDate? : string,
    sort? : JournalSortOption,
    order? : OrderOption,
    page? : number,
    limit? : number,
};

export type JournalSortOption = 'id' | 'name' | 'dateCreated' | 'lastUpdated';

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
