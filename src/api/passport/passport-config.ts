import {validatePassword} from "../../utils/password-utils";
const passportConfig = require('passport');
import LocalStrategy = require('passport-local');
import {User} from "../user/user.type";
import UserModel from "../user/user-model"

const customFields = {
    usernameField: 'username',
    passwordField: 'password',
};

const verifyCallback = async (username, password, done) => {
    const user: User  = await UserModel.findOne({username: username});
    if (!user) {
        done(null, false);
    } else {
        const isValid = validatePassword(password, user.hash);
        if (isValid)
            done(null, user);
        else
            done(null, false);
    }
};

const localStrategy = new LocalStrategy.Strategy(customFields, verifyCallback);

passportConfig.use(localStrategy);
passportConfig.serializeUser((user, done) => {
    done(null, user.id);
});

passportConfig.deserializeUser((userId, done) => {
    UserModel.findById(userId)
        .then(user => {
            done(null, user);
        }).catch(err => done(err));
});