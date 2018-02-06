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

exports.listNames = function(req, res, next) {
//    Vendor.find({}, {'name'}, function(err, vendors){
//        if (err) next(err);
//        else {
//            for (var i = 0; i<vendors)
//            res.send(vendors);
//        }
//    });
    Vendor.aggregate([
        { "$project": {
            "_id": 0,
            "vendorName": "$name"
        }}
    ], function(err, vendors){
        res.json(vendors);
    })

//    Vendor.find({}, 'name', function(err, vendors){
//        var counter = 0;
//        var out = [];
//        if (err) next(err);
//        else {
//            for (var i = 0; i < vendors.length; i++) {
//                counter++;
//                out.push(vendors[counter-1].name);
//            }
//            if (counter == vendors.length) {
//                res.send(out);
//            }
//        }
//    });
}