import {PASSWORD_SALT} from "./environment";
const crypto = require('crypto');

function encrypt(password: string) {
    return crypto.pbkdf2Sync(password, PASSWORD_SALT, 100000, 64, 'sha512').toString('hex');
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