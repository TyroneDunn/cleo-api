import {UsersRepository} from "./users-repository";
import UserModel from "./mongo-user-model";
import {User} from "./user";
import {now} from "mongoose";
import {DeleteUserDTO, GetUserDTO, GetUsersDTO, RegisterUserDTO, UpdateUserDTO} from "./users-dtos";
import {generateHash} from "../utils/password-utils";

const buildGetUsersQuery = (dto: GetUsersDTO) => {
    return {
        ... dto.id && {_id: dto.id},
        ... dto.idRegex && {_id: dto.idRegex},
        ... dto.username && {username: dto.username},
        ... dto.usernameRegex && {username: dto.usernameRegex},
        ... dto.isAdmin && {isAdmin: dto.isAdmin},
        ... (dto.startDate && !dto.endDate) && {dateCreated: {$gt: dto.startDate}},
        ... (!dto.startDate && dto.endDate) && {dateCreated: {$lt: dto.endDate}},
        ... (dto.startDate && dto.endDate) && {dateCreated: {$gte: dto.startDate, $lte: dto.endDate}},
    }
};

export const MongoUsersRepository: UsersRepository = {
    getUser: async (dto: GetUserDTO): Promise<User> => {
        if(dto.id)
            return UserModel.findById(dto.id)
        return UserModel.findOne({username: dto.username});
    },

    getUsers: async (dto: GetUsersDTO): Promise<User[]> => {
        const skip = (dto.page - 1) * dto.limit;
        const query = buildGetUsersQuery(dto);
        return UserModel.find(query)
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
        }).save(),

    deleteUser: async (dto: DeleteUserDTO): Promise<User> =>
        UserModel.findByIdAndDelete(dto.id),

    updateUser: async (dto: UpdateUserDTO): Promise<User> => {
        const query = {
            lastUpdated: now(),
            ... dto.username && {username: dto.username},
            ... dto.password && {hash: generateHash(dto.password)},
        };
        return UserModel.findByIdAndUpdate(
            dto.id,
            query,
            {new: true}
        );
    },

    isAdmin: async (id: string): Promise<boolean> => {
        try {
            const user: User = await UserModel.findById(id);
            return user.isAdmin;
        } catch (error) {
            return false;
        }
    },

    exists: async (id: string): Promise<boolean> => {
        try {
            const user: User = await UserModel.findById(id);
            return !!user;
        } catch (error) {
            return false;
        }
    },
};