import mongoose from "mongoose";
import {MONGODB_URL} from "./environment";

const database = mongoose.createConnection(MONGODB_URL);
export default database;