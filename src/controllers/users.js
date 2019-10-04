import express from 'express';
import passport from 'passport';

const router = express.Router();

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