'use strict';
module.exports = function(app) {
    var atas = require('../controllers/controller');

    // Routes
    app.route('/dangerzones')
        .get(atas.listDangerzones)
        .post(atas.createDangerzone);

    app.route('/dangerzones/:dangerzoneId')
        .get(atas.getDangerzone)
        .put(atas.updateDangerzone)
        .delete(atas.deleteDangerzone);

    app.route('/nodes')
        .get(atas.listNodes);

    app.route('/nodes/:nodeId')
        .get(atas.getNodeData);

    app.use(function(req, res) {
        res.status(404).send({url: req.originalUrl + ' not found'})
    });

};
