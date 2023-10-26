export type User = {
    _id: string,
    username: string,
    hash: string,
    dateCreated: Date,
    lastUpdated: Date,
    isAdmin: boolean,
    status: UserStatusOption,
};

export type UserStatusOption = 'active' | 'inactive' | 'suspended';

export type UserSortByOption = 'username' | 'id' | 'dateCreated' | 'lastUpdated';