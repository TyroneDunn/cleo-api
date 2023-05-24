import {
    PASSWORD_SALT,
    PASSWORD_LENGTH,
    HASHING_ITERATIONS,
    HASHING_ALGORITHM
} from "./environment";
const crypto = require('crypto');

function encrypt(password: string): string {
    return crypto.pbkdf2Sync(
        password,
        PASSWORD_SALT,
        HASHING_ITERATIONS,
        PASSWORD_LENGTH,
        HASHING_ALGORITHM
    ).toString('hex');
}

export function generateHash(password: string): string {
    return encrypt(password);
}

export function validatePassword(password: string, hash: string): boolean {
    const comparator: string = encrypt(password);
    return (hash === comparator);
}

// Tool for the developer to generate new salt.
// export function generateSalt() {
//     return crypto.randomBytes(256).toString('hex');
// }