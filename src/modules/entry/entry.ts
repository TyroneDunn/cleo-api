export type Entry = {
    _id: string,
    body: string,
    journal: any,
    lastUpdated: Date,
    dateCreated: Date,
};

export type EntrySortOption = 'id' | 'journal' | 'body' | 'dateCreated' | 'lastUpdated';
