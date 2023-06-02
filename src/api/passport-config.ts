const passportConfig = require('passport');
import LocalStrategy = require('passport-local');
import {User} from "../user/user.type";
import UserModel from "../user/mongo-user-model"
import {validatePassword} from "../utils/password-utils";

const userField = {
    usernameField: 'username',
    passwordField: 'password',
};

const verifyCallback = (username: string, password: string, done): void => {
    UserModel.findOne({username: username}, (error, user: User) => {
        if (!user) {
            done(null, false);
            return;
        }

        if (!validatePassword(password, user.hash)) {
            done(null, false);
            return;
        }

        done(null, user);
    });
};

const localStrategy = new LocalStrategy.Strategy(userField, verifyCallback);

passportConfig.use(localStrategy);
passportConfig.serializeUser((user, done) => {
    done(null, user.id);
});

passportConfig.deserializeUser((userId, done) => {
    UserModel.findById(userId, (error, user) => {
       if (error) {
           done(error);
           return;
       }
        done(null, user);
    });
});