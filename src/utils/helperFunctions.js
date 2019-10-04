import request from 'request-promise';
const PAGE_ACCESS_TOKEN = 'EAAipPa65D7sBADDa5nK4qSIPk9VjS0GPaTIUjIDr6bMf5Ns6OHGR3ZBOYt4eH5kTZCcClCK8C24O9ac2iWNfy44eIvDcvvcAfXhGNlYyEwAgBxlXbveYTj8ewrDn6b2dc227z5n6w4UbeivPAmTXkBVbOyKFETL4Ge7kmiPQZDZD';

// Sends response messages via the Send API
export async function callBradcast(response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    try {
        await request({
            "uri": "https://graph.facebook.com/v2.6/me/messages",
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "POST",
            "json": request_body
        });

    }
    catch (err) {
        console.error(err);
    }
}

// Sends response messages via the Send API
export async function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    try {
        await request({
            "uri": "https://graph.facebook.com/v2.6/me/messages",
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "POST",
            "json": request_body
        });

    }
    catch (err) {
        console.error(err);
    }
}

// Handles messaging_postbacks events
export function handlePostback(sender_psid, received_postback) {
    let response = [];

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'action@getStarted') {
        //save Participants
        var newParticipant = new Participant({ psid: sender_psid });
        newParticipant.save();
        response.push({
            "text": "Hi ! I will be your personal water trainer 🙂 you can call me Shakira 💧",
        });
        response.push({
            "text": "What I can do for you? ☑  Daily water reminders \n ☑  Personalized AI recommendations\n ☑  Number of cups of water drank this week\n ☑  Tips about water drinkingv",

        });
        response.push({
            "text": "Are you ready for this journey?",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Let's dig in",
                    "payload": "action@digIn"
                }
            ]
        });

    }
}

