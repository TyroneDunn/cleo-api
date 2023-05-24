import {
    PASSWORD_SALT,
    HASHING_ITERATIONS,
    PASSWORD_LENGTH,
    HASHING_ALGORITHM
} from "./environment";
const crypto = require('crypto');

const encrypt = (password: string): string =>
    crypto.pbkdf2Sync(
        password,
        PASSWORD_SALT,
        HASHING_ITERATIONS,
        PASSWORD_LENGTH,
        HASHING_ALGORITHM
    ).toString('hex');

export const generateHash = (password: string): string => encrypt(password);

export const validatePassword = (password: string, hash: string): boolean => {
    const comparator: string = encrypt(password);
    return (hash === comparator);
}

// Tool for the developer to generate new salt.
// export const generateSalt = () => crypto.randomBytes(256).toString('hex');