var User = require('mongoose').model('User');
var Vendor = require('mongoose').model('Vendor');
var utils = require('../utils/utils');

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, Vendor, 'create', req.params.userId, '', true);
};

exports.list = function(req, res, next) {
    utils.doWithAccess(req, res, next, Vendor, 'list', req.params.userId, '', false);
};

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, Vendor, 'read', req.params.userId, req.params.vendorId, false);
};

exports.update = function(req, res, next) {
    utils.doWithAccess(req, res, next, Vendor, 'update', req.params.userId, req.params.vendorId, true);
};

exports.delete = function(req, res, next) {
	utils.doWithAccess(req, res, next, Vendor, 'delete', req.params.userId, req.params.vendorId, true);
};

exports.listNameIds = function(req, res, next) {
    Vendor.find({}, '_id, name', function(err, vendors){
        if (err) next(err);
        else res.send(vendors);
    });
}