'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NodeDataSchema = new Schema({
    name: String,
    longitude: Number,
    latitude: Number,
    time: Date,
    alarm: Boolean,
    rssi: Number,
    snr: Number,
    gateway: String,
});
module.exports = mongoose.model('NodeData', NodeDataSchema);