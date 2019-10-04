const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const passport = require('passport');

var router = express.Router();

router

    .post('/login', passport.authenticate('login', { session: false }), async (req, res, next) => {

        res.send({ success: true, jwt: req.user });


    })
    .post('/register', passport.authenticate('jwt', { session: false }), passport.authenticate('singup', { session: false }), async (req, res, next) => {
        res.send({ success: true, message: "Singup success" });

    });

//send notifications to everyone

//update reminder text and response buttons

module.exports = router;