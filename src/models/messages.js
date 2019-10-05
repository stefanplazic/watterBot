const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const MessageSchema = new Schema({

    action: {
        type: String,
        required: true,

    },
    content: {
        type: Schema.Types.Mixed,
        required: true
    }
});

module.exports = mongoose.model('Message', MessageSchema);