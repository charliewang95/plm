var User = require('mongoose').model('User');
var ProductionLine = require('mongoose').model('ProductionLine');
var utils = require('../utils/utils');
var checkoutProcessor = require('../utils/checkoutProcessor');

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, ProductionLine, 'create', req.params.userId, '', true, true);
};

exports.list = function(req, res, next) {
    utils.doWithAccess(req, res, next, ProductionLine, 'list', req.params.userId, '', false, false);
};

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, ProductionLine, 'read', req.params.userId, req.params.productionLineId, false, false);
};

exports.update = function(req, res, next) {
    utils.doWithAccess(req, res, next, ProductionLine, 'update', req.params.userId, req.params.productionLineId, true, true);
};

exports.delete = function(req, res, next) {
	utils.doWithAccess(req, res, next, ProductionLine, 'delete', req.params.userId, req.params.productionLineId, true, true);
};

exports.markComplete = function(req, res, next) {
    checkoutProcessor.markComplete(req, res, next);
}

exports.getAllIdleServers = function(req, res, next) {
    ProductionLine.find({isIdle: true}, function(err, idles){
        if (err) return next(err);
        else return res.json(idles);
    });
}

exports.getProductionLineByName = function(req, res, next) {
    ProductionLine.findOne({nameUnique: req.params.productionLineName.toLowerCase()}, function(err, pl){
        if (err) return next(err);
        else return res.json(pl);
    });
}

