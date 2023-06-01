export type GetJournalDTO = {
    userId: string,
    id: string,
};

export type GetJournalsDTO = {
    userId: string,
    id?: string,
    idRegex?: string,
    name?: string,
    nameRegex?: string,
    author?: string,
    authorRegex?: string,
    sort?: 'id' | 'name' | 'author' | 'dateCreated' | 'lastUpdated',
    order: 1 | -1,
    startDate?: Date,
    endDate?: Date,
    page: number,
    limit: number,
};

export type CreateJournalDTO = {
    userId: string,
    name: string,
};

export type DeleteJournalDTO = {
    userId: string,
    id: string,
};

export type UpdateJournalDTO = {
    userId: string,
    id: string,
    name: string,
};