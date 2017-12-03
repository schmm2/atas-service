'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NodeSchema = new Schema({
    name: String,
    data : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NodeData'
    }]
});
module.exports = mongoose.model('Node', NodeSchema);