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

exports.updateNetwork = function(req, res, next){
    var items = req.body;
    updateNetworkHelper(res, next, 0, items, function(){
        res.json(items);
    });
};

var updateNetworkHelper = function(res, next, i, items, callback) {
    if (i == items.length) {
        callback();
    } else {
        var item = items[i];
        var productionName = item.productionName;
        var quantity = item.quantity;
        var totalRevenue = item.totalRevenue;
        DistributorNetwork.findOne({productionNameUnique: productionName.toLowerCase()}, function(err, dn){
            if (err) return next(err);
            else {
                if (quantity + dn.numSold > dn.numUnit) return res.status(400).send('Action Denied. Quantity of product '+
                    productionName+' in storage is '+(dn.numUnit - dn.numSold));
                var newSoldUnit = dn.numSold + quantity;
                var newTotalRevenue = dn.totalRevenue + totalRevenue;
                dn.update({totalRevenue: newTotalRevenue, numSold:newSoldUnit}, function(err, obj){
                    updateNetworkHelper(res, next, i+1, items, callback);
                });
            }
        });
    }
};

