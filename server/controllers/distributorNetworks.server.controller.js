var User = require('mongoose').model('User');
var DistributorNetwork = require('mongoose').model('DistributorNetwork');
var ProductFreshness = require('mongoose').model('ProductFreshness');
var utils = require('../utils/utils');
var freshness = require('../utils/freshness');

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
    var date = new Date();
    updateNetworkHelper(res, next, date, 0, items, function(){
        res.json(items);
    });
};

var updateNetworkHelper = function(res, next, date, i, items, callback) {
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
                    if (newSoldUnit == dn.numUnit) {
                        dn.remove(function(err){
                            freshness.findOne({productNameUnique: productionName.toLowerCase()}, function(err, fresh){
                                fresh.remove(function(err){
                                    updateNetworkHelper(res, next, date, i+1, items, callback);
                                })
                            })
                        })
                    } else {
                        freshness.updateProductAverageDelete(res, next, date, dn, quantity, function(){
                            freshness.updateProductOldestDelete(res, next, date, dn, quantity, function(){
                                updateNetworkHelper(res, next, date, i+1, items, callback);
                            })
                        })
                    }
                });
            }
        });
    }
};

exports.getFresh = function(req, res, next) {
    console.log("get product fresh called");
    DistributorNetwork.find({}, function(err, dns){
        getFreshHelper(req, res, next, 0, dns, function(){
            console.log('got it?');
            ProductFreshness.find({}, function(err, fresh){
                //console.log(fresh);
                res.json(fresh);
            });
        });
    });
}

var getFreshHelper = function(req, res, next, i, dns, callback){
    console.log(i+' '+dns.length)
    if (i == dns.length){
        callback();
    } else {
        var dn = dns[i];
        var productName = dn.productName;
        freshness.getProductLatestInfo(res, next, productName, function(){
            getFreshHelper(req, res, next, i+1, dns, callback);
        });
    }
}

