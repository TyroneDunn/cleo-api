export type Journal = {
    _id: string,
    name: string,
    author: string,
    dateCreated: Date,
    lastUpdated: Date,
};

export type JournalSortOption = 'id' | 'name' | 'dateCreated' | 'lastUpdated';