var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Vendor = mongoose.model('Vendor');

exports.modify = function(model, item, res, next, callback) {
    if (model == Order) {
        modifyOrder(item, res, next, function(err, obj){
            if (err) return next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else if (model == Vendor) {
        modifyVendor(item, res, next, function(err, obj){
            if (err) next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else callback(false, item);
};

var modifyOrder = function(item, res, next, callback) { //add number of pounds to order
    Order.getNumPounds(item.ingredientId, item.package, res, next, function(err, pounds){
        if (err) {
            return next(err);
        }
        else {
            var str = JSON.stringify(item).slice(0,-1)+',"pounds":'+pounds+'}';
            callback(err, JSON.parse(str));
        }
    });
};

var modifyVendor = function(item, res, next, callback) { //add unique lowercase code to check code uniqueness
    var code = item.code.toLowerCase();
    var str = JSON.stringify(item).slice(0,-1)+',"codeUnique":"'+code+'"}';
    callback(0, JSON.parse(str));
};