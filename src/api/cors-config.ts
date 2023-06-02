import {CorsOptions} from "cors";
import {APP_URL} from "../environment";

export const corsOptions: CorsOptions = {
    origin: [
        '*',
        APP_URL,
    ],
    allowedHeaders: `Content-Type,credentials`,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "DELETE", "PATCH"],
};