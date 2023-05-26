import {CorsOptions} from "cors";

const CLEO_APP_URL = `https://localhost:4200`;
export const corsOptions: CorsOptions = {
    origin: [
        '*',
        CLEO_APP_URL,
    ],
    allowedHeaders: `Content-Type,credentials`,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "DELETE", "PATCH"],
};