import {UsersRepository} from "./users-repository.type";
import UserModel from "./mongo-user-model.type";
import {
    DeleteUserRequest,
    DeleteUsersRequest,
    GetUserRequest,
    GetUsersRequest,
    UpdateUserRequest,
    UpdateUsersRequest,
    UsersFilter,
    UserUpdateFields,
} from "./users.types";
import { CommandResult, User, Error, HashUtility} from '@hals/common';
import { GetRecordsResponse } from '../shared/get-records-response.type';
import { DeleteResult } from 'mongodb';
import { UpdateWriteOpResult } from "mongoose";
import {
    HASHING_ALGORITHM,
    HASHING_ITERATIONS,
    PASSWORD_LENGTH,
    PASSWORD_SALT,
} from '../environment';

const generateHash : (password: string) => string  = HashUtility(
   PASSWORD_SALT,
   HASHING_ITERATIONS,
   PASSWORD_LENGTH,
   HASHING_ALGORITHM).generateHash;

export const MongoUsersRepository: UsersRepository = {
    getUser: async (request: GetUserRequest): Promise<User | Error> => {
        try {
            const user : User | null = await UserModel.findOne({ username: request.username });
            if (!user) return Error('NotFound', `User ${request.username} not found.`);
            else return user;
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    getUsers: async (request: GetUsersRequest): Promise<GetRecordsResponse<User> | Error> => {
        try {
            const filter = mapToGetUsersFilter(request.filter);
            const count = await UserModel.countDocuments(filter);
            const query = UserModel.find(filter);
            if (request.sort !== undefined)
                query.sort({ [request.sort.sortBy]: request.sort.order === 'asc' ? 1 : -1 });
            if (request.page !== undefined) {
                query.skip(request.page.index * request.page.limit);
                query.limit(request.page.limit);
            }
            return {
                count: count,
                collection: await query.exec(),
            };
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    updateUsers: async (request: UpdateUsersRequest): Promise<CommandResult | Error> => {
        try {
            const filter = mapToUsersFilter(request);
            const query = mapToUpdateUsersQuery(request);
            const result: UpdateWriteOpResult = await UserModel.updateMany(filter, query);
            return CommandResult(result.acknowledged, result.modifiedCount);
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    updateUser: async (request: UpdateUserRequest): Promise<User | Error> => {
        try {
            const query = mapToUpdateUserQuery(request.updateFields);
            return UserModel.findOneAndUpdate(
               { username: request.username },
               query,
               { new: true }
            );
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    deleteUsers: async (request: DeleteUsersRequest): Promise<CommandResult | Error> => {
        try {
            const filter = mapToUsersFilter(request);
            const result: DeleteResult = await UserModel.deleteMany(filter);
            return CommandResult(result.acknowledged, result.deletedCount);
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    deleteUser: async (request: DeleteUserRequest): Promise<CommandResult | Error> => {
        try {
            const result: DeleteResult = await UserModel.deleteOne({ username: request.username });
            return CommandResult(result.acknowledged, result.deletedCount);
        }
        catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },

    exists: async (username: string): Promise<boolean | Error> => {
        try {
            const user: User | null = await UserModel.findOne({username: username});
            return !!user;
        } catch (error) {
            return Error("Internal", (error as Error).message);
        }
    },
};

const mapToGetUsersFilter = (filter: UsersFilter) => ({
    ... filter && {
        ...filter.username && {username: filter.username},
        ...filter.usernameRegex && {username: {$regex: filter.usernameRegex, $options: 'i'}},
        ... filter.timestamps && {
            ... filter.timestamps.createdAt && {
                ... (filter.timestamps.createdAt.start && !filter.timestamps.createdAt.end) && {createdAt: {$gt: filter.timestamps.createdAt.start}},
                ... (!filter.timestamps.createdAt.start && filter.timestamps.createdAt.end) && {createdAt: {$lt: filter.timestamps.createdAt.end}},
                ... (filter.timestamps.createdAt.start && filter.timestamps.createdAt.end) && {createdAt: {$gte: filter.timestamps.createdAt.start, $lte: filter.timestamps.createdAt.end}},
            },
            ... filter.timestamps.updatedAt && {
                ... (filter.timestamps.updatedAt.start && !filter.timestamps.updatedAt.end) && {updatedAt: {$gt: filter.timestamps.updatedAt.start}},
                ... (!filter.timestamps.updatedAt.start && filter.timestamps.updatedAt.end) && {updatedAt: {$lt: filter.timestamps.updatedAt.end}},
                ... (filter.timestamps.updatedAt.start && filter.timestamps.updatedAt.end) && {updatedAt: {$gte: filter.timestamps.updatedAt.start, $lte: filter.timestamps.updatedAt.end}},
            },
        },
    },
});

const mapToUsersFilter = (dto: UpdateUsersRequest) => ({
    ...dto.usernameRegex && {username: {$regex: dto.usernameRegex, $options: 'i'}},
    ...dto.isAdmin && {isAdmin: (dto.isAdmin.toLowerCase() === 'true')},
    ...dto.status && {status: dto.status},
    ...(dto.startDate && !dto.endDate) && {dateCreated: {$gt: dto.startDate}},
    ...(!dto.startDate && dto.endDate) && {dateCreated: {$lt: dto.endDate}},
    ...(dto.startDate && dto.endDate) && {dateCreated: {$gte: dto.startDate, $lte: dto.endDate}},
});

const mapToUpdateUsersQuery = (dto: UpdateUsersRequest) => ({
    ...dto.newIsAdmin && {isAdmin: (dto.newIsAdmin.toLowerCase() === 'true')},
    ...dto.newStatus && {status: dto.newStatus}
});

const mapToUpdateUserQuery = (update: UserUpdateFields) => ({
    ...update.username && {username: update.username},
    ...update.password && {hash: generateHash(update.password)},
});
