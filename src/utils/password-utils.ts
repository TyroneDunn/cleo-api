import {PASSWORD_SALT, HASHING_ITERATIONS, HASHING_ALGORITHM} from "./environment";
const crypto = require('crypto');

function encrypt(password: string) {
    return crypto.pbkdf2Sync(
        password,
        PASSWORD_SALT,
        HASHING_ITERATIONS,
        64,
        HASHING_ALGORITHM
    ).toString('hex');
}

export function generateHash(password: string) {
    return encrypt(password);
}

export function validatePassword(password: string, hash: string): boolean {
    const comparator = encrypt(password);
    return (hash === comparator);
}

// Tool for the developer to generate new salt.
// export function generateSalt() {
//     return crypto.randomBytes(256).toString('hex');
// }