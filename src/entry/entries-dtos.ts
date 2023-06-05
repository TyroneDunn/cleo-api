export type GetEntryDTO = {
    id: string,
};

export type GetEntriesDTO = {
    idRegex?: string,
    body?: string,
    bodyRegex?: string,
    journal?: string,
    journalRegex?: string,
    sort?: 'id' | 'body' | 'journal' | 'dateCreated' | 'lastUpdated',
    order?: 1 | -1,
    startDate?: Date,
    endDate?: Date,
    page?: number,
    limit?: number,
};

export type CreateEntryDTO = {
    journal: string,
    body: string,
};

export type DeleteEntryDTO = {
    id: string,
};

export type UpdateEntryDTO = {
    id: string,
    body?: string,
    journal?: string,
};
