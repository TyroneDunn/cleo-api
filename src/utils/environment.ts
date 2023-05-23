require('dotenv').config();
export const API_TITLE = process.env.TITLE;
export const API_PORT = parseInt(process.env.CLEO_PORT);
export const MONGO_DB_URL = process.env.MONGO_DB_URL;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const PASSWORD_SALT = process.env.PASSWORD_SALT;
