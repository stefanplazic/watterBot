'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var saltRounds = 10;
//Define a schema
var Schema = mongoose.Schema;
var UserSchema = new Schema({

    email: {
        type: String,
        trim: true,
        required: true,
        uniqe: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    }
});
// hash user password before saving into database
UserSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

UserSchema.methods.isValidPassword = async function (password) {
    var user = this;
    //Hashes the password sent by the user for login and checks if the hashed password stored in the 
    //database matches the one sent. Returns true if it does else false.
    var compare = await bcrypt.compare(password, user.password);
    return compare;
};

module.exports = mongoose.model('User', UserSchema);
//# sourceMappingURL=users.js.map