'use strict';

var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;
var ReminderSchema = new Schema({

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
//# sourceMappingURL=reminders.js.map