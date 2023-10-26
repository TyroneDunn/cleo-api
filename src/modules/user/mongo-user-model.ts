import {User, UserStatusOption} from "./user";
import {Document, Schema} from 'mongoose';
import database from "../../mongoose-database";

interface UserDocument extends Document, User {
    _id: string,
    username: string,
    hash: string,
    isAdmin: boolean,
    status: UserStatusOption,
    dateCreated: Date,
    lastUpdated: Date,
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
    isAdmin: {
        type: Boolean,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true,
    },
    lastUpdated: {
        type: Date,
        required: true,
    },
});

const UserModel = database.model<UserDocument>('User', userSchema);
export default UserModel;