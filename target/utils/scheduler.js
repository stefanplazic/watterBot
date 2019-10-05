'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nodeCron = require('node-cron');

var _nodeCron2 = _interopRequireDefault(_nodeCron);

var _participants = require('../models/participants');

var _participants2 = _interopRequireDefault(_participants);

var _reminders = require('../models/reminders');

var _reminders2 = _interopRequireDefault(_reminders);

var _helperFunctions = require('./helperFunctions');

var _messages = require('../models/messages');

var _messages2 = _interopRequireDefault(_messages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schedule = async function schedule() {

    try {

        var result = await _reminders2.default.find();
        result.forEach(function (reminder) {
            _nodeCron2.default.schedule(reminder.cron, async function () {
                //select users which have given reminder
                var participants = await _participants2.default.find({ frequency: reminder.label });
                participants.forEach(async function (participant) {
                    var response = await _messages2.default.findOne({ action: 'action@reminder' });
                    (0, _helperFunctions.callSendAPI)(participant.psid, response.content);
                });
            });
        });
    } catch (err) {
        console.error(err);
    }
};

var dummy = async function dummy() {
    var participants = await _participants2.default.find();
    participants.forEach(async function (participant) {
        var response = await _messages2.default.findOne({ action: 'action@reminder' });
        (0, _helperFunctions.callSendAPI)(participant.psid, response.content);
    });
};

exports.default = schedule;
//# sourceMappingURL=scheduler.js.map