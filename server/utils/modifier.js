var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Vendor = mongoose.model('Vendor');

exports.modify = function(model, item, next, callback) {
    if (model == Order) {
        modifyOrder(item, next, function(err, obj){
            if (err) next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else if (model == Vendor) {
        modifyVendor(item, next, function(err, obj){
            if (err) next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else callback(false, item);
};

var modifyOrder = function(item, next, callback) {
    Order.getNumPounds(item.ingredientId, item.package, next, function(err, pounds){
        if (err) {
            next(err);
        }
        else {
            var str = JSON.stringify(item).slice(0,-1)+',"pounds":'+pounds+'}';
            callback(err, JSON.parse(str));
        }
    });
};

var modifyVendor = function(item, next, callback) {
    var code = item.code.toLowerCase();
    var str = JSON.stringify(item).slice(0,-1)+',"codeUnique":"'+code+'"}';
    callback(0, JSON.parse(str));
};