'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _participants = require('../models/participants');

var _participants2 = _interopRequireDefault(_participants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PAGE_ACCESS_TOKEN = 'EAAipPa65D7sBADDa5nK4qSIPk9VjS0GPaTIUjIDr6bMf5Ns6OHGR3ZBOYt4eH5kTZCcClCK8C24O9ac2iWNfy44eIvDcvvcAfXhGNlYyEwAgBxlXbveYTj8ewrDn6b2dc227z5n6w4UbeivPAmTXkBVbOyKFETL4Ge7kmiPQZDZD';
var router = _express2.default.Router();

/*create a test webhook*/
// Creates the endpoint for our webhook 
router.post('/webhook', function (req, res) {

    var body = req.body;

    if (body.object === 'page') {

        body.entry.forEach(function (entry) {

            var webhook_event = entry.messaging[0];

            // Get the sender PSID
            var sender_psid = webhook_event.sender.id;

            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}).get('/webhook', function (req, res) {
    var VERIFY_TOKEN = "stef";

    var mode = req.query['hub.mode'];
    var token = req.query['hub.verify_token'];
    var challenge = req.query['hub.challenge'];

    // Check if a token and mode were sent
    if (mode && token) {

        // Check the mode and token sent are correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Respond with 200 OK and challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

// Handles messages events
function handleMessage(sender_psid, received_message) {
    var response = [];

    // Check if the message contains text
    if (received_message.text) {
        var textEntered = received_message.text.toLowerCase();

        if (textEntered === 'menu' || textEntered === 'back') {
            response.push({
                "text": "Welcome to this super menu",
                "quick_replies": [{
                    "content_type": "text",
                    "title": "Info",
                    "payload": "action@info"
                }, {
                    "content_type": "text",
                    "title": "Change alerts",
                    "payload": "action@ChangeAlerts"
                }]
            });
        } else if (textEntered === 'info') {

            response.push({
                "text": "Thank you for asking such a cool question! 🙂 I am the best waterbot ever writen. My author is Stefan Plazic",
                "quick_replies": [{
                    "content_type": "text",
                    "title": "Back",
                    "payload": "action@back"
                }]
            });
        } else if (textEntered === 'change alerts') {

            response.push({
                "text": "Ok let's get rolling! 🙂 Choose the frequency for water break reminders",
                "quick_replies": [{
                    "content_type": "text",
                    "title": "Once a day",
                    "payload": "action@onceReminder"
                }, {
                    "content_type": "text",
                    "title": "Two times a day",
                    "payload": "action@twoReminder"
                }, {
                    "content_type": "text",
                    "title": "Three times a day",
                    "payload": "action@threeReminder"
                }]
            });
        } else if (textEntered === '1-2 cups' || textEntered === "don't count") {

            response.push({
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Whats wrong with you?",

                            "image_url": "https://townsquare.media/site/295/files/2015/01/Loser-630x420.jpg?w=980&q=75"

                        }]
                    }
                }
            });
            response.push({ "text": "Recommended amount of water per day is eight 8-ounce glasses, equals to about 2 liters, or half a gallon." });
            response.push({
                "text": "Choose the frequency for water break reminders",
                "quick_replies": [{
                    "content_type": "text",
                    "title": "Once a day",
                    "payload": "action@onceReminder"
                }, {
                    "content_type": "text",
                    "title": "Two times a day",
                    "payload": "action@twoReminder"
                }, {
                    "content_type": "text",
                    "title": "Three times a day",
                    "payload": "action@threeReminder"
                }]
            });
        } else if (textEntered === '3-5 cup' || textEntered === "6 or more cup") {

            response.push({
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Congratualions you are a great person!",

                            "image_url": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/584748de-c26e-4434-beb8-393f80645804/d35chph-1aacba54-dc38-4396-abba-9e8e53906a66.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU4NDc0OGRlLWMyNmUtNDQzNC1iZWI4LTM5M2Y4MDY0NTgwNFwvZDM1Y2hwaC0xYWFjYmE1NC1kYzM4LTQzOTYtYWJiYS05ZThlNTM5MDZhNjYuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.5RIH9tF1VPclyztlUZIZ0YCD7O6QIfuOd7OeQW30BOw"

                        }]
                    }
                }
            });
            response.push({
                "text": "Choose the frequency for water break reminders",
                "quick_replies": [{
                    "content_type": "text",
                    "title": "Once a day",
                    "payload": "action@onceReminder"
                }]
            });
        } else if (textEntered === "let's dig in") {
            response.push({
                "text": "Ok let's get rolling! 🙂 Tell us how many cups of watter you drink daily?",
                "quick_replies": [{
                    "content_type": "text",
                    "title": "1-2 cups",
                    "payload": "action@cup"
                }, {
                    "content_type": "text",
                    "title": "3-5 cup",
                    "payload": "action@cup"
                }, {
                    "content_type": "text",
                    "title": "6 or more cup",
                    "payload": "action@cup"
                }, {
                    "content_type": "text",
                    "title": "don't count",
                    "payload": "action@cup"
                }]
            });
        } else
            // Create the payload for a basic text message
            response.push({
                "text": 'Sorry I am a stupid bot, if you have any questions type Menu'
            });
    }

    // await callSendAPI(sender_psid, item);
    response.forEach(function (item, index) {
        setTimeout(async function () {
            await callSendAPI(sender_psid, item);
        }, 1000 * index);
    });
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    var response = [];

    // Get the payload for the postback
    var payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'action@getStarted') {
        //save Participants
        var newParticipant = new _participants2.default({ psid: sender_psid });
        newParticipant.save();
        response.push({
            "text": "Hi ! I will be your personal water trainer 🙂 you can call me Shakira 💧"
        });
        response.push({
            "text": "What I can do for you? ☑  Daily water reminders \n ☑  Personalized AI recommendations\n ☑  Number of cups of water drank this week\n ☑  Tips about water drinkingv"

        });
        response.push({
            "text": "Are you ready for this journey?",
            "quick_replies": [{
                "content_type": "text",
                "title": "Let's dig in",
                "payload": "action@digIn"
            }]
        });
    }

    // Send the message to acknowledge the postback
    response.forEach(function (item, index) {
        setTimeout(async function () {
            await callSendAPI(sender_psid, item);
        }, 1000 * index);
    });
}

//get user Info
var userInfo = async function userInfo(sender_psid) {

    try {
        var rep = await _requestPromise2.default.get("https://graph.facebook.com/" + sender_psid + "?fields=first_name&access_token=" + PAGE_ACCESS_TOKEN);
        console.log(rep);
    } catch (err) {
        console.error(err);
    }
};

// Sends response messages via the Send API
async function callSendAPI(sender_psid, response) {
    // Construct the message body
    var request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    };
    try {
        await (0, _requestPromise2.default)({
            "uri": "https://graph.facebook.com/v2.6/me/messages",
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "POST",
            "json": request_body
        });
    } catch (err) {
        console.error(err);
    }
}

module.exports = router;
//# sourceMappingURL=chats.js.map