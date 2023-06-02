import mongoose from "mongoose";
import {MONGO_DB_URL} from "./utils/environment";

const database = mongoose.createConnection(MONGO_DB_URL);
export default database;