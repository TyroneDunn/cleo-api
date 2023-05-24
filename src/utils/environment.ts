require('dotenv').config();
export const API_TITLE: string = process.env.TITLE;
export const API_PORT: number = parseInt(process.env.CLEO_PORT);
export const MONGO_DB_URL: string = process.env.MONGO_DB_URL;
export const SESSION_SECRET: string = process.env.SESSION_SECRET;
export const PASSWORD_SALT: string = process.env.PASSWORD_SALT;
export const PASSWORD_LENGTH: number = parseInt(process.env.PASSWORD_LENGTH);
export const HASHING_ALGORITHM: string = process.env.HASHING_ALGORITHM;
export const HASHING_ITERATIONS: number = parseInt(process.env.HASHING_ITERATIONS);