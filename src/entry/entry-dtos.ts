export type GetEntryDTO = {
    userId: string,
    id: string,
};

export type GetEntriesDTO = {
    userId: string,
    idRegex?: string,
    body?: string,
    bodyRegex?: string,
    journal?: string,
    journalRegex?: string,
    sort?: 'id' | 'name' | 'author' | 'dateCreated' | 'lastUpdated',
    order?: 1 | -1,
    startDate?: Date,
    endDate?: Date,
    page?: number,
    limit?: number,
};

export type CreateEntryDTO = {
    userId: string,
    journal: string,
    body: string,
};

export type DeleteEntryDTO = {
    userId: string,
    id: string,
};

export type UpdateEntryDTO = {
    userId: string,
    id: string,
    body: string,
    journal: string,
};
