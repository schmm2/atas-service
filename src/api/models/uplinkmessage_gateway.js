'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UplinkMessageGatewaySchema = new Schema({
    rssi: Number,
    snr: Number,
    gtw_id: String,
});
module.exports = mongoose.model('UplinkMessageGateway', UplinkMessageGatewaySchema);