export type GetJournalDTO = {
    id: string,
};

export type GetJournalsDTO = {
    idRegex?: string,
    name?: string,
    nameRegex?: string,
    author?: string,
    authorRegex?: string,
    sort?: 'id' | 'name' | 'author' | 'dateCreated' | 'lastUpdated',
    order?: 1 | -1,
    startDate?: Date,
    endDate?: Date,
    page?: number,
    limit?: number,
};

export type CreateJournalDTO = {
    author: string,
    name: string,
};

export type DeleteJournalDTO = {
    id: string,
};

export type UpdateJournalDTO = {
    id: string,
    name: string,
};