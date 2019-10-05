'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.callBradcast = callBradcast;
exports.callSendAPI = callSendAPI;
exports.handlePostback = handlePostback;
exports.updateBotMessage = updateBotMessage;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _participants = require('../models/participants');

var _participants2 = _interopRequireDefault(_participants);

var _messages = require('../models/messages');

var _messages2 = _interopRequireDefault(_messages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PAGE_ACCESS_TOKEN = 'EAAipPa65D7sBADDa5nK4qSIPk9VjS0GPaTIUjIDr6bMf5Ns6OHGR3ZBOYt4eH5kTZCcClCK8C24O9ac2iWNfy44eIvDcvvcAfXhGNlYyEwAgBxlXbveYTj8ewrDn6b2dc227z5n6w4UbeivPAmTXkBVbOyKFETL4Ge7kmiPQZDZD';
async function callBradcast(message) {
    var response = { "text": message };
    var participants = await _participants2.default.find();
    participants.forEach(function (participant) {
        callSendAPI(participant.psid, response);
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
            "text": "What I can do for you? ☑  Daily water reminders \n ☑  Personalized AI recommendations\n ☑  Tips about water drinking"

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
}

// Update message
async function updateBotMessage(action, text, quickReplies) {
    // Construct the message body
    try {
        var content = {};

        //put quick replies
        var quickRep = [];
        quickReplies.forEach(function (replay) {
            var repl = {
                "content_type": "text",
                "title": replay,
                "payload": "action@drank"
            };
            quickRep.push(repl);
        });
        content = { "text": text, "quick_replies": quickRep };

        //save to message
        var messageSaved = await _messages2.default.findOne({ action: action });
        messageSaved.content = content;
        messageSaved = await messageSaved.save();
        console.log(messageSaved);
    } catch (err) {
        console.error(err);
    }
}
//# sourceMappingURL=helperFunctions.js.map