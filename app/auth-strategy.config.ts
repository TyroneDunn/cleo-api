import {
   HASHING_ALGORITHM,
   HASHING_ITERATIONS,
   MONGODB_URL,
   PASSWORD_LENGTH,
   PASSWORD_SALT,
   SESSION_SECRET,
   USERS_DB_NAME,
   USERS_DB_OPTION,
} from "./environment";
import { HashAlgorithm, LocalStrategy } from "@hals/common";
import { DatabaseOption } from "@hals/common/lib/auth/local-strategy.type";

const authStrategy: LocalStrategy = {
   usersDbName: USERS_DB_NAME,
   usersDbUrl: MONGODB_URL,
   usersDbOption: USERS_DB_OPTION as DatabaseOption,
   sessionSecret: SESSION_SECRET,
   hashingAlgorithm: HASHING_ALGORITHM as HashAlgorithm,
   hashingIterations: HASHING_ITERATIONS,
   passwordSalt: PASSWORD_SALT,
   passwordLength: PASSWORD_LENGTH,
};

export default authStrategy;
