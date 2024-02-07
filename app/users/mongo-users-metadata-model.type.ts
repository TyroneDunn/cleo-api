import { UserMetadata, UserPrivilegeOptions, UserStatusOption } from "./users.types";
import {Document, Schema} from 'mongoose';
import database from "../database/mongoose-database";

interface UserMetadataDocument extends Document, UserMetadata {
    _id: string,
    username: string,
    privileges: UserPrivilegeOptions[],
    status: UserStatusOption,
    createdAt: Date,
    updatedAt: Date,
}

const userMetadataSchema = new Schema<UserMetadataDocument>({
    username: {
        type: String,
        unique: true,
        required: true
    },
    privileges: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const UsersMetadataModel = database.model<UserMetadataDocument>('users-metadata', userMetadataSchema);
export default UsersMetadataModel;
