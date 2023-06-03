const passportConfig = require('passport');
import LocalStrategy = require('passport-local');
import {User} from "../user/user.type";
import {USERS_REPOSITORY} from "../repositories-config";
import {validatePassword} from "../utils/password-utils";
import {QueryArgs} from "../user/users-repository";

const userField = {
    usernameField: 'username',
    passwordField: 'password',
};

const verifyCallback = async (username: string, password: string, done): Promise<void> => {
    const args: QueryArgs = {username: username}
    const user: User = await USERS_REPOSITORY.getUser(args);
    if (!user) {
        done(null, false);
        return;
    }

    if (!validatePassword(password, user.hash)) {
        done(null, false);
        return;
    }

    done(null, user);
};

const localStrategy = new LocalStrategy.Strategy(userField, verifyCallback);

passportConfig.use(localStrategy);
passportConfig.serializeUser((user, done) => {
    done(null, user.id);
});

passportConfig.deserializeUser(async (userId, done) => {
    try {
        const args: QueryArgs = {id: userId};
        const user = await USERS_REPOSITORY.getUser(args);
        done(null, user);
    } catch (error) {
        done(error);
    }
});