var Order = require('mongoose').model('Order');
var utils = require('../utils/utils');

exports.create = function(req, res, next) {
	utils.doWithAccess(req, res, next, Order, 'create', req.params.userId, '', false, true);
};

exports.list = function(req, res, next) {
	utils.doWithAccess(req, res, next, Order, 'list', req.params.userId, '', false, true);
};

exports.listPartial = function(req, res, next) {
	utils.doWithAccess(req, res, next, Order, 'listPartial', req.params.userId, '', false, true);
};

exports.read = function(req, res, next) {
    utils.doWithAccess(req, res, next, Order, 'readWithUserAccess', req.params.userId, req.params.orderId, false, true);
    //utils.doWithAccess(req, res, next, Order, 'readWithUserAccess', req.params.userId, req.params.orderId, false);
};

exports.update = function(req, res, next) {
    utils.doWithAccess(req, res, next, Order, 'updateWithUserAccess', req.params.userId, req.params.orderId, true, true);
    //utils.doWithAccess(req, res, next, Order, 'updateWithUserAccess', req.params.userId, req.params.orderId, false);
};

exports.delete = function(req, res, next) {
    utils.doWithAccess(req, res, next, Order, 'deleteWithUserAccess', req.params.userId, req.params.orderId, true, true);
    //utils.doWithAccess(req, res, next, Order, 'deleteWithUserAccess', req.params.userId, req.params.orderId, false);
};

exports.checkout = function(req, res, next) {
    utils.doWithAccess(req, res, next, Order, 'checkoutOrders', req.params.userId, '', false, true);
};

exports.listPendings = function(req, res, next) {

}