import {QueryArgs, UsersRepository} from "./users-repository";
import UserModel from "./mongo-user-model";
import {User} from "./user.type";

export const MongoUsersRepository: UsersRepository = {
    exists: async (args: QueryArgs): Promise<boolean> => {
        try {
            const user: User = await UserModel.findById(args.id);
            return !!user;
        } catch (error) {
            return false;
        }
    },

    registerUser: async (args: QueryArgs): Promise<User> =>
        new UserModel({
            username: args.username,
            hash: args.hash,
        }).save(),
};