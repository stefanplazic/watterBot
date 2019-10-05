'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _helperFunctions = require('../utils/helperFunctions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/login', _passport2.default.authenticate('login', { session: false }), async function (req, res, next) {

    res.send({ success: true, jwt: req.user });
}).post('/register', _passport2.default.authenticate('jwt', { session: false }), _passport2.default.authenticate('singup', { session: false }), async function (req, res, next) {
    res.send({ success: true, message: "Singup success" });
})

//send notifications to everyone
.post('/broadcast', _passport2.default.authenticate('jwt', { session: false }), async function (req, res, next) {
    (0, _helperFunctions.callBradcast)(req.body.message);
    res.send({ success: true, message: "Notification successfully sent." });
})
//update reminder text and response buttons
.post('/botUpdate', _passport2.default.authenticate('jwt', { session: false }), async function (req, res, next) {
    var text = req.body.text;
    var quickReplies = req.body.quickReplies;
    var action = "action@reminder";
    //cal the update function
    (0, _helperFunctions.updateBotMessage)(action, text, quickReplies);
    res.send({ success: true, message: "Bot Message succesfully updated" });
});

module.exports = router;
//# sourceMappingURL=users.js.map