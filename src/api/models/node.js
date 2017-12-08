'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NodeSchema = new Schema({
    name: String,
    uplinkmessages : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UplinkMessage'
    }]
});
module.exports = mongoose.model('Node', NodeSchema);