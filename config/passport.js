const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const jwt = require('jsonwebtoken');
const UserModel = require('../models/users.js');
const SECRET_KEY = require('./databaseconfig').secretKey;
//singup


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