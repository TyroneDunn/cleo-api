import {Journal} from "./journal.type";

export type QueryArgs = {
    id?: string,
    idRegex?: string,
    name?: string,
    nameRegex?: string,
    author?: string,
    authorRegex?: string,
};

export type SortArgs = {
    sort?: 'id' | 'name' | 'author' | 'dateCreated' | 'lastUpdated',
    order: 1 | -1,
}

export type FilterArgs = {
    startDate?: Date,
    endDate?: Date,
};

export type PaginationArgs = {
    page: number,
    limit: number,
};

export type JournalsRepository = {
    getJournal: (args: QueryArgs) => Promise<Journal>,
    getJournals: (
        queryArgs: QueryArgs,
        sortArgs: SortArgs,
        filterArgs: FilterArgs,
        paginationArgs: PaginationArgs,
    ) => Promise<Journal[]>,
    createJournal: (args: QueryArgs) => Promise<Journal>,
    deleteJournal: (args: QueryArgs) => Promise<Journal>,
    updateJournal: (args: QueryArgs) => Promise<Journal>,
};