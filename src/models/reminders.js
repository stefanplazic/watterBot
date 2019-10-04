const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const ReminderSchema = new Schema({

    label: {
        type: String,
        required: true,
        uniqe: true
    },
    cron: {
        type: String,
        required: true,
        uniqe: true
    }
});

module.exports = mongoose.model('Reminder', ReminderSchema);