var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Ingredient = mongoose.model('Ingredient');
var IngredientPrice = mongoose.model('IngredientPrice');
var Vendor = mongoose.model('Vendor');
var VendorPrice = mongoose.model('VendorPrice');
var Storage = mongoose.model('Storage');
var Inventory = mongoose.model('Inventory');
var Cart = mongoose.model('Cart');

exports.process = function(model, item, res, next, callback) {
//    if (model == Vendor) {
//        processVendor(item, res, next, function(){
//            callback();
//        });
//    }
//    else if (model == Storage) {
//        validateStorage(item, res, next, function(err, obj){
//            if (err) return next(err);
//            else {
//                callback(err, obj);
//            }
//        });
//    }
    if (model == Cart) {
        processCart(item, res, next, function(err, obj){
            if (err) return next(err);
            else {
                 callback(err, obj);
            }
        });
    }
    else {
        callback(false, true);
    }
};

var processCart = function(item, res, next, callback) { //
    var ingredientId = item.ingredientId;
    var quantity;
    Inventory.findOne({ingredientId: ingredientId}, function(err, obj){
        if (err) return next(err);
        else if (!obj) {
            res.status(400);
            res.send("Ingredient doesn't exist in inventory");
        }
        else {
            quantity = obj.quantity - item.quantity;
            updateInventory(ingredientId, quantity, res, next, function(err2, obj2){
                if (err2) return next(err2);
                else {
                    callback(err2, true);
                }
            });
        }
    });
};

var updateInventory = function(ingredientId, quantity, res, next, callback) {
    Inventory.findOneAndUpdate({ingredientId: ingredientId}, {quantity: quantity}, function(err, obj) {
        if (err) return next(err);
        else {
            callback(err, null);
        }
    });
};
