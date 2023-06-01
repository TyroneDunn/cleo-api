export type GetJournalDTO = {
    userId: string,
    id: string,
};

export type GetJournalsDTO = {
    userId: string,
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