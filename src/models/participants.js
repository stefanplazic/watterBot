const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const ParticipantSchema = new Schema({

    psid: {
        type: String,
        required: true,
        uniqe: true
    },

    frequency: {
        type: String,

    }
});

module.exports = mongoose.model('Participant', ParticipantSchema);