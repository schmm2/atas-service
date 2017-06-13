'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DangerzoneSchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    points : [{
        lat : Number,
        lng : Number
    }]
});
module.exports = mongoose.model('Dangerzone', DangerzoneSchema);