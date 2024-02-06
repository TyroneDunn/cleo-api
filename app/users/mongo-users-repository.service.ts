import {UsersRepository} from "./users-repository.type";
import UserModel from "./mongo-user-model.type";
import {User} from "./users.types";
import {now} from "mongoose";
import {
    DeleteUserRequest,
    DeleteUsersRequest,
    GetUserRequest,
    GetUsersRequest,
    RegisterAdminRequest,
    RegisterUserRequest,
    UpdateUserRequest,
    UpdateUsersRequest
} from "./users-dtos";
import {generateHash} from "../utils/password-utils";

export const MongoUsersRepository: UsersRepository = {
    getUser: async (dto: GetUserRequest): Promise<User> =>
        UserModel.findOne({username: dto.username}),

    getUsers: async (dto: GetUsersRequest): Promise<User[]> => {
        const filter = mapToGetUsersFilter(dto);
        const skip = (dto.page - 1) * dto.limit;
        return UserModel.find(filter)
            .sort({[dto.sort]: dto.order})
            .skip(skip)
            .limit(dto.limit);
    },

    registerUser: async (dto: RegisterUserRequest): Promise<User> =>
        new UserModel({
            username: dto.username,
            hash: generateHash(dto.password),
            dateCreated: now(),
            lastUpdated: now(),
            isAdmin: false,
            status: 'active',
        }).save(),

    registerAdminUser: async (dto: RegisterAdminRequest): Promise<User> =>
        new UserModel({
            username: dto.username,
            hash: generateHash(dto.password),
            dateCreated: now(),
            lastUpdated: now(),
            isAdmin: true,
            status: 'active',
        }).save(),

    updateUsers: async (dto: UpdateUsersRequest): Promise<User[]> => {
        const filter = mapToUsersFilter(dto);
        const query = mapToUpdateUsersQuery(dto);
        await UserModel.updateMany(
            filter,
            query
        );
        return UserModel.find(filter);
    },

    updateUser: async (dto: UpdateUserRequest): Promise<User> => {
        const query = mapToUpdateUserQuery(dto);
        return UserModel.findOneAndUpdate(
            {username: dto.username},
            query,
            {new: true}
        );
    },

    deleteUsers: async (dto: DeleteUsersRequest): Promise<string> => {
        const filter = mapToUsersFilter(dto);
        const result = await UserModel.deleteMany(filter);
        return `${result.deletedCount} users deleted.`;
    },

    deleteUser: async (dto: DeleteUserRequest): Promise<User> =>
        UserModel.findOneAndDelete({username: dto.username}),

    isAdmin: async (username: string): Promise<boolean> => {
        try {
            const user: User = await UserModel.findOne({username: username});
            return user.isAdmin;
        } catch (error) {
            return false;
        }
    },

    exists: async (username: string): Promise<boolean> => {
        try {
            const user: User = await UserModel.findOne({username: username});
            return !!user;
        } catch (error) {
            return false;
        }
    },
};

const mapToGetUsersFilter = (dto: GetUsersRequest) => ({
    ...dto.username && {username: dto.username},
    ...dto.usernameRegex && {username: {$regex: dto.usernameRegex, $options: 'i'}},
    ...dto.isAdmin && {isAdmin: (dto.isAdmin.toLowerCase() === 'true')},
    ...dto.status && {status: dto.status},
    ...(dto.startDate && !dto.endDate) && {dateCreated: {$gt: dto.startDate}},
    ...(!dto.startDate && dto.endDate) && {dateCreated: {$lt: dto.endDate}},
    ...(dto.startDate && dto.endDate) && {dateCreated: {$gte: dto.startDate, $lte: dto.endDate}},
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

const mapToUpdateUserQuery = (dto: UpdateUserRequest) => ({
    lastUpdated: now(),
    ...dto.newUsername && {username: dto.newUsername},
    ...dto.newPassword && {hash: generateHash(dto.newPassword)},
    ...dto.newIsAdmin && {isAdmin: (dto.newIsAdmin.toLowerCase() === 'true')},
    ...dto.newStatus && {status: dto.newStatus}
});
