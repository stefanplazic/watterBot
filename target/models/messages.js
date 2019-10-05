'use strict';

var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;
var MessageSchema = new Schema({

    action: {
        type: String,
        required: true

    },
    content: {
        type: Schema.Types.Mixed,
        required: true
    }
});

module.exports = mongoose.model('Message', MessageSchema);
//# sourceMappingURL=messages.js.map