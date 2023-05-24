import {validatePassword} from "../../utils/password-utils";
import {User} from "../../user/user.type";
import UserModel from "../../user/user-model"

const passportConfig = require('passport');
import LocalStrategy = require('passport-local');

const customFields = {
    usernameField: 'username',
    passwordField: 'password',
};

const verifyCallback = async (username: string, password: string, done) => {
    UserModel.findOne({username: username}, (error, user: User) => {
        if (!user) {
            done(null, false);
            return;
        }

        if (validatePassword(password, user.hash))
            done(null, user);
        else
            done(null, false);
    });
};

const localStrategy = new LocalStrategy.Strategy(customFields, verifyCallback);

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