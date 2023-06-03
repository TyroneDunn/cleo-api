import {FilterArgs, PaginationArgs, QueryArgs, SortArgs, UsersRepository} from "./users-repository";
import UserModel from "./mongo-user-model";
import {User} from "./user.type";
import {now} from "mongoose";

type GetUsersQuery = {
    _id?: any,
    username?: any,
    hash?: any,
    dateCreated?: any,
    lastUpdated?: any,
    isAdmin?: any,
};

const buildGetUsersQuery = (queryArgs: QueryArgs, filterArgs: FilterArgs) => {
    let query: GetUsersQuery = {};
    if (queryArgs.id)
        query._id = queryArgs.id;
    if (queryArgs.idRegex)
        query._id = {$regex: queryArgs.idRegex, $options: 'i'};
    if (queryArgs.username)
        query.username = queryArgs.username;
    if (queryArgs.usernameRegex)
        query.username = {$regex: queryArgs.usernameRegex, $options: 'i'};
    if (queryArgs.hash)
        query.hash = queryArgs.hash;
    if (queryArgs.hashRegex)
        query.hash = {$regex: queryArgs.hashRegex, $options: 'i'};
    if (queryArgs.isAdmin)
        query.isAdmin = queryArgs.isAdmin;
    if (filterArgs.startDate && !filterArgs.endDate)
        query.dateCreated = {$gt: filterArgs.startDate};
    if (!filterArgs.startDate && filterArgs.endDate)
        query.dateCreated = {$lt: filterArgs.endDate};
    if (filterArgs.startDate && filterArgs.endDate)
        query.dateCreated = {$gte: filterArgs.startDate, $lte: filterArgs.endDate};
    return query;
};
export const MongoUsersRepository: UsersRepository = {
    getUser: async (args: QueryArgs): Promise<User> =>
        UserModel.findById(args.id),

    getUsers: async (
        queryArgs: QueryArgs,
        sortArgs: SortArgs,
        filterArgs: FilterArgs,
        paginationArgs: PaginationArgs
    ): Promise<User[]> => {
        const skip = (paginationArgs.page - 1) * paginationArgs.limit;
        const query = buildGetUsersQuery(queryArgs, filterArgs);
        return UserModel.find(query)
            .sort({[sortArgs.sort]: sortArgs.order})
            .skip(skip)
            .limit(paginationArgs.limit);
    },

    registerUser: async (args: QueryArgs): Promise<User> =>
        new UserModel({
            username: args.username,
            hash: args.hash,
            dateCreated: now(),
            lastUpdated: now(),
            isAdmin: args.isAdmin,
        }).save(),

    deleteUser: async (args: QueryArgs): Promise<User> =>
        UserModel.findByIdAndDelete(args.id),

    updateUser: async (args: QueryArgs): Promise<User> => {
        let query:  {
            username?: string,
            hash?: string,
            isAdmin?: boolean,
            lastUpdated: Date,
        } = {lastUpdated: now()};
        if (args.username)
            query.username = args.username;
        if (args.hash)
            query.hash = args.hash;
        if (args.isAdmin)
            query.isAdmin = args.isAdmin;

        return UserModel.findByIdAndUpdate(
            args.id,
            query,
            {new: true}
        );
    },

    isAdmin: async (args: QueryArgs): Promise<boolean> => {
        try {
            const user: User = await UserModel.findById(args.id);
            return user.isAdmin;
        } catch (error) {
            return false;
        }
    },

    exists: async (args: QueryArgs): Promise<boolean> => {
        try {
            const user: User = await UserModel.findById(args.id);
            return !!user;
        } catch (error) {
            return false;
        }
    },
};