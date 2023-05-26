const ObjectId = require('mongoose').Types.ObjectId;

export const isValidObjectId = (id: string): boolean => {
    return ObjectId.isValid(id);
}