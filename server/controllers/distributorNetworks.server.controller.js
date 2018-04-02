var User = require('mongoose').model('User');
var DistributorNetwork = require('mongoose').model('DistributorNetwork');
var utils = require('../utils/utils');

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, DistributorNetwork, 'create', req.params.userId, '', true, true);
};

exports.list = function(req, res, next) {
    utils.doWithAccess(req, res, next, DistributorNetwork, 'list', req.params.userId, '', false, false);
};

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, DistributorNetwork, 'read', req.params.userId, req.params.distributorNetworkId, false, false);
};

exports.update = function(req, res, next) {
    utils.doWithAccess(req, res, next, DistributorNetwork, 'update', req.params.userId, req.params.distributorNetworkId, true, true);
};

exports.delete = function(req, res, next) {
	utils.doWithAccess(req, res, next, DistributorNetwork, 'delete', req.params.userId, req.params.distributorNetworkId, true, true);
};


