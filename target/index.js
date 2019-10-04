'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.PORT || 3000;
var PAGE_ACCESS_TOKEN = 'EAAipPa65D7sBADDa5nK4qSIPk9VjS0GPaTIUjIDr6bMf5Ns6OHGR3ZBOYt4eH5kTZCcClCK8C24O9ac2iWNfy44eIvDcvvcAfXhGNlYyEwAgBxlXbveYTj8ewrDn6b2dc227z5n6w4UbeivPAmTXkBVbOyKFETL4Ge7kmiPQZDZD';

app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());
app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));

/*create a test webhook*/
// Creates the endpoint for our webhook 
app.post('/webhook', function (req, res) {

    var body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            var webhook_event = entry.messaging[0];
            console.log(webhook_event);

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
});

app.get('/webhook', function (req, res) {

    /** UPDATE YOUR VERIFY TOKEN **/
    var VERIFY_TOKEN = "stef";

    // Parse params from the webhook verification request
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
                "text": "Wellcome to this super menu",
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

    response.forEach(async function (item) {
        await callSendAPI(sender_psid, item);
    });
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    var response = [];

    // Get the payload for the postback
    var payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'action@getStarted') {
        response.push({ "text": "Hi Stefan! I will be your personal water trainer 🙂 you can call me Shakira 💧" });
        response.push({ "text": "What I can do for you? ☑  Daily water reminders \n ☑  Personalized AI recommendations\n ☑  Number of cups of water drank this week\n ☑  Tips about water drinking" });

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
    response.forEach(async function (item) {
        await callSendAPI(sender_psid, item);
    });
}

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
        var rep = (0, _request2.default)({
            "uri": "https://graph.facebook.com/v2.6/me/messages",
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "POST",
            "json": request_body
        });
    } catch (err) {
        console.error(err);
    }
}

//listen to the port
app.listen(port, function () {
    console.log('Node server listening on port ' + port);
});
//# sourceMappingURL=index.js.map