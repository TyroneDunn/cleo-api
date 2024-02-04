export type Entry = {
    _id: string,
    title: string,
    body: string,
    journal: any,
    lastUpdated: Date,
    dateCreated: Date,
};

export type EntrySortOption = 'id' | 'journal' | 'title' | 'body' | 'dateCreated' | 'lastUpdated';
