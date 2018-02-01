var Order = require('mongoose').model('Order');
var utils = require('../utils/utils');

exports.create = function(req, res, next) {
	utils.doWithAccess(req, res, next, Order, 'create', req.params.userId, '', false);
};

exports.list = function(req, res, next) {
	utils.doWithAccess(req, res, next, Order, 'list', req.params.userId, '', false);
};

exports.listPartial = function(req, res, next) {
	utils.doWithAccess(req, res, next, Order, 'listPartial', req.params.userId, '', false);
};

exports.read = function(req, res, next) {
    utils.doWithAccess(req, res, next, Order, 'read', req.params.userId, req.params.orderId, false);
    //utils.doWithAccess(req, res, next, Order, 'readWithUserAccess', req.params.userId, req.params.orderId, false);
};

exports.update = function(req, res, next) {
    utils.doWithAccess(req, res, next, Order, 'update', req.params.userId, req.params.orderId, true);
    //utils.doWithAccess(req, res, next, Order, 'updateWithUserAccess', req.params.userId, req.params.orderId, false);
};

exports.delete = function(req, res, next) {
    utils.doWithAccess(req, res, next, Order, 'delete', req.params.userId, req.params.orderId, true);
    //utils.doWithAccess(req, res, next, Order, 'deleteWithUserAccess', req.params.userId, req.params.orderId, false);
};