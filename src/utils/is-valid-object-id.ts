const ObjectId = require('mongoose').Types.ObjectId;

export const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);