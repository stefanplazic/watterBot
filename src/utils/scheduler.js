import cron from 'node-cron';
import Participant from '../models/participants';
import Reminder from '../models/reminders';
import { callSendAPI } from './helperFunctions';


const schedule = async () => {

    try {

        /*const newReminder = new Reminder({label:'2 times a day',cron:'0 6,12,20 * * *'});
        await newReminder.save();*/
        //find all reminders in database
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

