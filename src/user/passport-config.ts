import {GetUserDTO} from "./users-dtos";
const passportConfig = require('passport');
import LocalStrategy = require('passport-local');
import {User} from "./user";
import {USERS_REPOSITORY} from "../repositories-config";
import {validateHash} from "../utils/password-utils";

const userField = {
    usernameField: 'username',
    passwordField: 'password',
};

const verifyCallback = async (username: string, password: string, done): Promise<void> => {
    const dto: GetUserDTO = {username: username};
    const user: User = await USERS_REPOSITORY.getUser(dto);
    if (!user) {
        done(null, false);
        return;
    }

    if (!validateHash(password, user.hash)) {
        done(null, false);
        return;
    }

    if (user.status != 'active') {
        done(null, false);
        return;
    }

    done(null, user);
};

const localStrategy = new LocalStrategy.Strategy(userField, verifyCallback);

passportConfig.use(localStrategy);
passportConfig.serializeUser((user, done) => {
    done(null, user.username);
});

passportConfig.deserializeUser(async (username, done) => {
    try {
        const dto: GetUserDTO = {username: username};
        const user = await USERS_REPOSITORY.getUser(dto);
        done(null, user);
    } catch (error) {
        done(error);
    }
});