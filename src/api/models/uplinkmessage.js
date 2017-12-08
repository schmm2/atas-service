'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UplinkMessageSchema = new Schema({
    longitude: Number,
    latitude: Number,
    time: Date,
    counter: Number,
    buttonpressed: Boolean,
    indangerzone: Boolean,
    coding_rate: String,
    data_rate: String,
    gateways: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UplinkMessageGateway'
    }],
});
module.exports = mongoose.model('UplinkMessage', UplinkMessageSchema);