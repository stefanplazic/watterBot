import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/users.js';
import databaseConfig from './databaseConfig';

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const SECRET_KEY = databaseConfig.secretKey;

//login 
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async function (email, password, done) {
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        try {
            const user = await UserModel.findOne({ email });
            if (!user)
                return done(null, false, { message: 'Incorrect email or password.' })

            //check if password is correct
            const validate = await user.isValidPassword(password);
            if (!validate)
                return done(null, false, { message: 'Incorrect email or password.' })

            //everything is ok - return jwt token with user id and email
            const signedJwt = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY);

            return done(null, signedJwt);
        }

        catch (err) { done(err); }
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY
},
    function (jwtPayload, done) {

        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return UserModel.findById(jwtPayload.id)
            .then(user => {
                return done(null, user);
            })
            .catch(err => {
                return done(err);
            });
    }
));

//singup
passport.use('singup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
    async function (req, email, password, done) {

        try {
            process.nextTick(async function () {
                const user = await UserModel.findOne({ email });
                if (user)
                    return done(null, false, { message: 'Email allready taken' })

                //create user
                var newUser = new UserModel();
                newUser.email = email;
                newUser.password = password;
                await newUser.save();
                //everything is ok
                return done(null, newUser);
            });
        }

        catch (err) { done(err); }
    }
));