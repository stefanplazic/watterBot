'use strict';

var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;
var ParticipantSchema = new Schema({

    psid: {
        type: String,
        required: true,
        uniqe: true
    },

    frequency: {
        type: String

    }
});

module.exports = mongoose.model('Participant', ParticipantSchema);
//# sourceMappingURL=participants.js.map