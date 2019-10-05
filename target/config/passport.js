'use strict';

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _passportJwt = require('passport-jwt');

var _passportJwt2 = _interopRequireDefault(_passportJwt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _users = require('../models/users.js');

var _users2 = _interopRequireDefault(_users);

var _databaseConfig = require('./databaseConfig');

var _databaseConfig2 = _interopRequireDefault(_databaseConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalStrategy = _passportLocal2.default.Strategy;
var JWTStrategy = _passportJwt2.default.Strategy;
var ExtractJWT = _passportJwt2.default.ExtractJwt;
var SECRET_KEY = _databaseConfig2.default.secretKey;

//login 
_passport2.default.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async function (email, password, done) {
    //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
    try {
        var user = await _users2.default.findOne({ email: email });
        if (!user) return done(null, false, { message: 'Incorrect email or password.' });

        //check if password is correct
        var validate = await user.isValidPassword(password);
        if (!validate) return done(null, false, { message: 'Incorrect email or password.' });

        //everything is ok - return jwt token with user id and email
        var signedJwt = _jsonwebtoken2.default.sign({ id: user._id, email: user.email }, SECRET_KEY);

        return done(null, signedJwt);
    } catch (err) {
        done(err);
    }
}));

_passport2.default.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY
}, function (jwtPayload, done) {

    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return _users2.default.findById(jwtPayload.id).then(function (user) {
        return done(null, user);
    }).catch(function (err) {
        return done(err);
    });
}));

//singup
_passport2.default.use('singup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async function (req, email, password, done) {

    try {
        process.nextTick(async function () {
            var user = await _users2.default.findOne({ email: email });
            if (user) return done(null, false, { message: 'Email allready taken' });

            //create user
            var newUser = new _users2.default();
            newUser.email = email;
            newUser.password = password;
            await newUser.save();
            //everything is ok
            return done(null, newUser);
        });
    } catch (err) {
        done(err);
    }
}));
//# sourceMappingURL=passport.js.map