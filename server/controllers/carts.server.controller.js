var User = require('mongoose').model('User');
var Cart = require('mongoose').model('Cart');
var utils = require('../utils/utils');

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, Cart, 'create', req.params.userId, '', false);
}

exports.list = function(req, res, next) {
    utils.doWithAccess(req, res, next, Cart, 'listPartial', req.params.userId, '', false);
}

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, Cart, 'readWithUserAccess', req.params.userId, req.params.cartId, false);
};

exports.update = function(req, res, next) {
    utils.doWithAccess(req, res, next, Cart, 'updateWithUserAccess', req.params.userId, req.params.cartId, false);
};

exports.delete = function(req, res, next) {
	utils.doWithAccess(req, res, next, Cart, 'deleteWithUserAccess', req.params.userId, req.params.cartId, false);
};

exports.deleteAll = function(req, res, next) {
    utils.doWithAccess(req, res, next, Cart, 'deleteAllWithUserAccess', req.params.userId, '', false);
};