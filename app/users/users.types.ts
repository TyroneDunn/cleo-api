import { OrderOption, Page, Timestamps, User } from '@hals/common';

export type UserMetadata = {
    username: string,
    status: UserStatusOption,
    privileges: UserPrivilegeOptions[],
};

export type UserStatusOption =
   | 'active'
   | 'inactive'
   | 'suspended';

export type UserPrivilegeOptions =
   | "admin"
   | "superuser";

export type GetUserRequest = {
    user : User,
    username : string
};

export type GetUsersRequest = {
    user : User,
    filter? : UsersFilter,
    sort? : UsersSort,
    page? : Page,
};

export type UsersFilter = {
    username? : string,
    usernameRegex? : string,
    privilege? : UserPrivilegeOptions[];
    status? : UserStatusOption[],
    timestamps? : Timestamps
};

export type UsersSort = {
    sortBy: UserSortOption,
    order: OrderOption
}

export type UserSortOption =
   | 'username'
   | 'id'
   | 'createdAt'
   | 'updatedAt';

export type UpdateUserRequest = {
    user : User,
    username : string,
    updateFields: UserUpdateFields,
};

export type UserUpdateFields = {
    username? : string,
    password? : string,
    privilege? : UserPrivilegeOptions[],
    status? : UserStatusOption[],
};

export type UpdateUsersRequest = {
    user : User,
    usernameRegex? : string,
    isAdmin? : string,
    status? : UserStatusOption,
    startDate? : string,
    endDate? : string,
    newIsAdmin? : string,
    newStatus? : UserStatusOption,
};

export type DeleteUserRequest = {
    user : User,
    username : string
};

export type DeleteUsersRequest = {
    user : User,
    usernameRegex? : string,
    isAdmin? : string,
    status? : UserStatusOption,
    startDate? : string,
    endDate? : string,
};
