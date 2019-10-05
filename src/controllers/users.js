import express from 'express';
import passport from 'passport';
import { updateBotMessage, callBradcast } from '../utils/helperFunctions';

const router = express.Router();

router

    .get('/', async (req, res, next) => {

        res.send({ success: true, message: 'hi' });


    })
    .post('/login', passport.authenticate('login', { session: false }), async (req, res, next) => {

        res.send({ success: true, jwt: req.user });


    })
    .post('/register', passport.authenticate('jwt', { session: false }), passport.authenticate('singup', { session: false }), async (req, res, next) => {
        res.send({ success: true, message: "Singup success" });

    })

    //send notifications to everyone
    .post('/broadcast', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
        callBradcast(req.body.message);
        res.send({ success: true, message: "Notification successfully sent." });

    })
    //update reminder text and response buttons
    .post('/botUpdate', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
        const text = req.body.text;
        const quickReplies = req.body.quickReplies;
        const action = "action@reminder";
        //cal the update function
        updateBotMessage(action, text, quickReplies);
        res.send({ success: true, message: "Bot Message succesfully updated" });

    })
    ;



module.exports = router;