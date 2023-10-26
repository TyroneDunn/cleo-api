import {UsersRepository} from "./users-repository";
import UserModel from "./mongo-user-model";
import {User} from "./user";
import {now} from "mongoose";
import {
    DeleteUserDTO,
    DeleteUsersDTO,
    GetUserDTO,
    GetUsersDTO,
    RegisterAdminDTO,
    RegisterUserDTO,
    UpdateUserDTO,
    UpdateUsersDTO
} from "./users-dtos";
import {generateHash} from "../../utils/password-utils";

export const MongoUsersRepository: UsersRepository = {
    getUser: async (dto: GetUserDTO): Promise<User> =>
        UserModel.findOne({username: dto.username}),

    getUsers: async (dto: GetUsersDTO): Promise<User[]> => {
        const filter = mapToGetUsersFilter(dto);
        const skip = (dto.page - 1) * dto.limit;
        return UserModel.find(filter)
            .sort({[dto.sort]: dto.order})
            .skip(skip)
            .limit(dto.limit);
    },

    registerUser: async (dto: RegisterUserDTO): Promise<User> =>
        new UserModel({
            username: dto.username,
            hash: generateHash(dto.password),
            dateCreated: now(),
            lastUpdated: now(),
            isAdmin: false,
            status: 'active',
        }).save(),

    registerAdminUser: async (dto: RegisterAdminDTO): Promise<User> =>
        new UserModel({
            username: dto.username,
            hash: generateHash(dto.password),
            dateCreated: now(),
            lastUpdated: now(),
            isAdmin: true,
            status: 'active',
        }).save(),

    updateUsers: async (dto: UpdateUsersDTO): Promise<User[]> => {
        const filter = mapToUpdateUsersFilter(dto);
        const query = mapToUpdateUsersQuery(dto);
        await UserModel.updateMany(
            filter,
            query
        );
        return UserModel.find(filter);
    },

    updateUser: async (dto: UpdateUserDTO): Promise<User> => {
        const query = mapToUpdateUserQuery(dto);
        return UserModel.findOneAndUpdate(
            {username: dto.username},
            query,
            {new: true}
        );
    },

    deleteUsers: async (dto: DeleteUsersDTO): Promise<string> => {
        const filter = mapToDeleteUsersFilter(dto);
        const result = await UserModel.deleteMany(filter);
        return `${result.deletedCount} users deleted.`;
    },

    deleteUser: async (dto: DeleteUserDTO): Promise<User> =>
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

const mapToGetUsersFilter = (dto: GetUsersDTO) => ({
    ...dto.username && {username: dto.username},
    ...dto.usernameRegex && {username: {$regex: dto.usernameRegex, $options: 'i'}},
    ...dto.isAdmin && {isAdmin: (dto.isAdmin.toLowerCase() === 'true')},
    ...dto.status && {status: dto.status},
    ...(dto.startDate && !dto.endDate) && {dateCreated: {$gt: dto.startDate}},
    ...(!dto.startDate && dto.endDate) && {dateCreated: {$lt: dto.endDate}},
    ...(dto.startDate && dto.endDate) && {dateCreated: {$gte: dto.startDate, $lte: dto.endDate}},
});

const mapToUpdateUsersFilter = (dto: UpdateUsersDTO) => ({
    ...dto.usernameRegex && {username: {$regex: dto.usernameRegex, $options: 'i'}},
    ...dto.isAdmin && {isAdmin: (dto.isAdmin.toLowerCase() === 'true')},
    ...dto.status && {status: dto.status},
    ...(dto.startDate && !dto.endDate) && {dateCreated: {$gt: dto.startDate}},
    ...(!dto.startDate && dto.endDate) && {dateCreated: {$lt: dto.endDate}},
    ...(dto.startDate && dto.endDate) && {dateCreated: {$gte: dto.startDate, $lte: dto.endDate}},
});


const mapToUpdateUsersQuery = (dto: UpdateUsersDTO) => ({
    ...dto.newIsAdmin && {isAdmin: (dto.newIsAdmin.toLowerCase() === 'true')},
    ...dto.newStatus && {status: dto.newStatus}
});

const mapToUpdateUserQuery = (dto: UpdateUserDTO) => ({
    lastUpdated: now(),
    ...dto.newUsername && {username: dto.newUsername},
    ...dto.newPassword && {hash: generateHash(dto.newPassword)},
    ...dto.newIsAdmin && {isAdmin: (dto.newIsAdmin.toLowerCase() === 'true')},
    ...dto.newStatus && {status: dto.newStatus}
});

const mapToDeleteUsersFilter = (dto: DeleteUsersDTO) => ({
    ...dto.usernameRegex && {username: {$regex: dto.usernameRegex, $options: 'i'}},
    ...dto.isAdmin && {isAdmin: (dto.isAdmin.toLowerCase() === 'true')},
    ...dto.status && {status: dto.status},
    ...(dto.startDate && !dto.endDate) && {dateCreated: {$gt: dto.startDate}},
    ...(!dto.startDate && dto.endDate) && {dateCreated: {$lt: dto.endDate}},
    ...(dto.startDate && dto.endDate) && {dateCreated: {$gte: dto.startDate, $lte: dto.endDate}},
});
