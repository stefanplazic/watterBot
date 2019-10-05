import cron from 'node-cron';
import Participant from '../models/participants';
import Reminder from '../models/reminders';
import { callSendAPI } from './helperFunctions';
import Message from '../models/messages';

const schedule = async () => {

    try {

        const result = await Reminder.find();
        result.forEach((reminder) => {
            cron.schedule(reminder.cron, async () => {
                //select users which have given reminder
                const participants = await Participant.find({ frequency: reminder.label });
                participants.forEach(async (participant) => {
                    let response = await Message.findOne({ action: 'action@reminder' });
                    callSendAPI(participant.psid, response.content);
                })
            });
        });

    }
    catch (err) { console.error(err); }

}

const dummy = async () => {
    const participants = await Participant.find();
    participants.forEach(async (participant) => {
        let response = await Message.findOne({ action: 'action@reminder' });
        callSendAPI(participant.psid, response.content);
    });
}

export default schedule;

