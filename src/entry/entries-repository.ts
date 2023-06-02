import {Entry} from "./entry.type";

export type QueryArgs = {
    id?: string,
    idRegex?: string,
    body?: string,
    bodyRegex?: string,
    journal?: string,
    journalRegex?: string,
};

export type SortArgs = {
    sort?: 'id' | 'body' | 'journal' | 'dateCreated' | 'lastUpdated',
    order?: 1 | -1,
}

export type FilterArgs = {
    startDate?: Date,
    endDate?: Date,
};

export type PaginationArgs = {
    page?: number,
    limit?: number,
};


export type EntriesRepository = {
    getEntry: (args: QueryArgs) => Promise<Entry>,
    getEntries: (
        queryArgs: QueryArgs,
        sortArgs: SortArgs,
        filterArgs: FilterArgs,
        paginationArgs: PaginationArgs,
    ) => Promise<Entry[]>,
    createEntry: (args: QueryArgs) => Promise<Entry>,
    deleteEntry: (args: QueryArgs) => Promise<Entry>,
    updateEntry: (args: QueryArgs) => Promise<Entry>,
    exists: (args: QueryArgs) => Promise<boolean>,
    ownsEntry: (args: QueryArgs) => Promise<boolean>,
};
