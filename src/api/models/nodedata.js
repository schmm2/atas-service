'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NodeDataSchema = new Schema({
    longitude: Number,
    latitude: Number,
    time: Date,
    buttonpressed: Boolean,
    rssi: Number,
    snr: Number,
    gateway: String,
});
module.exports = mongoose.model('NodeData', NodeDataSchema);