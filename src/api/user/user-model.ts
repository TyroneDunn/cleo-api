import database from "../../utils/mongoose-database";
import {Document, Schema} from 'mongoose';
import {User} from "./user.type";

export interface UserDocument extends Document, User {
    _id: string,
    username: string,
    hash: string,
}

const userSchema = new Schema<UserDocument>({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
});

const UserModel = database.model<UserDocument>('User', userSchema);
export default UserModel;