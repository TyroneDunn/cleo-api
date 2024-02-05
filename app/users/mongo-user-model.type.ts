import {User, UserStatusOption} from "./users.types";
import {Document, Schema} from 'mongoose';
import database from "../database/mongoose-database";

interface UserDocument extends Document, User {
    _id: string,
    username: string,
    hash: string,
    isAdmin: boolean,
    status: UserStatusOption,
    createdAt: Date,
    updatedAt: Date,
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
}, {
    timestamps: true
});

const UserModel = database.model<UserDocument>('User', userSchema);
export default UserModel;