const ObjectId = require('mongoose').Types.ObjectId;

export function isValidObjectId(id: string): boolean {
    return ObjectId.isValid(id);
}