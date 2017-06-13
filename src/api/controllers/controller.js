'use strict';

var mongoose = require('mongoose'),
Dangerzone = mongoose.model('Dangerzone');

exports.listDangerzones = function(req, res) {
    Dangerzone.find({}, function(err, dangerzone) {
        if (err)
            res.send(err);
        res.json(dangerzone);
    });
};

exports.createDangerzone = function(req, res) {
    var newDangerzone = new Dangerzone(req.body);
    newDangerzone.save(function(err, dangerzone) {
        if (!err) {
            res.json(dangerzone);
        } else {
            res.json(err);
        }
    });
};

// Single Object
exports.getDangerzone = function(req, res) {
    Dangerzone.findById(req.params.dangerzoneId, function(err, dangerzone) {
        if (err)
            res.send(err);
        res.json(dangerzone);
    });
};

exports.deleteDangerzone = function(req, res) {
    Dangerzone.remove({
        _id: req.params.dangerzoneId
    }, function(err, dangerzone) {
        if (err)
            res.send(err);
        // success
        res.json({ code: '200' });
    });
};

exports.updateDangerzone = function(req, res) {
    Dangerzone.findOneAndUpdate(req.params.dangerzoneId, req.body, {new: true}, function(err, dangerzone) {
        if (err)
            res.send(err);
        res.json(dangerzone);
    });
};