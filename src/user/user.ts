export type User = {
    _id: string,
    username: string,
    hash: string,
    dateCreated: Date,
    lastUpdated: Date,
    isAdmin: boolean,
};