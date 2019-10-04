import cron from 'node-cron';
import Participant from '../models/participants';
import Reminder from '../models/reminders';
import { callSendAPI, callBradcast } from './helperFunctions';


const schedule = async () => {

    try {
        callBradcast('A water drinking and health style news are coming soon');
        const result = await Reminder.find();
        result.forEach((reminder) => {
            cron.schedule(reminder.cron, async () => {
                //select users which have given reminder
                const participants = await Participant.find({ frequency: reminder.label });
                participants.forEach((participant) => {
                    let response = {
                        "text": "Water reminder",
                        "quick_replies": [
                            {
                                "content_type": "text",
                                "title": "1 cup of watter",
                                "payload": "action@drankOne"
                            },
                            {
                                "content_type": "text",
                                "title": "2 cup of watter",
                                "payload": "action@drankTwo"
                            }
                        ]
                    };
                    callSendAPI(participant.psid, response);
                })
            });
        });

    }
    catch (err) { console.error(err); }

}

export default schedule;

