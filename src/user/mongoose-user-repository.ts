import {UserRepository} from "./user-repository.type";
import {generateHash} from "../utils/password-utils";
import UserModel from "./user-model";

export class MongooseUserRepository implements UserRepository {
    async registerUser(username: string, password: string): Promise<void> {
        const newUser = new UserModel({
            username: username,
            hash: generateHash(password),
        });
        await newUser.save();
    }

    async userExists(username: string): Promise<Boolean> {
        const user = await UserModel.findOne({username: username});
        if (!user)
            return false;
        else
            return true;
    }
}