import { APP_URL } from "./environment";
import { CorsOptions, OK } from "@hals/common";

const corsOptions: CorsOptions = {
   origin: [
      '*',
      APP_URL,
   ],
   allowedHeaders: 'Content-Type,credentials',
   credentials: true,
   optionsSuccessStatus: OK,
   methods: [ "GET", "POST", "DELETE", "PATCH" ],
};

export default corsOptions;
