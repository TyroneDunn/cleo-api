export type User = {
    _id: string,
    username: string,
    hash: string,
    createdAt: Date,
    updatedAt: Date,
    isAdmin: boolean,
    status: UserStatusOption,
};

export type UserStatusOption = 'active' | 'inactive' | 'suspended';

export type UserSortOption = 'username' | 'id' | 'createdAt' | 'updatedAt';