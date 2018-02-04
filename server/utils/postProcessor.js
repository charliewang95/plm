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

exports.process = function(model, item, itemId, res, next) {
    if (model == Vendor) {
        processVendor(itemId, res, next);
    }
//    else if (model == Storage) {
//        validateStorage(item, res, next, function(err, obj){
//            if (err) return next(err);
//            else {
//                callback(err, obj);
//            }
//        });
//    }
    else if (model == Cart) {
        processCart(item, res, next);
    }
};

var processCart = function(item, res, next) { //
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
            updateInventory(ingredientId, quantity, res, next, function(err, obj2){
                if (err) return next(err);
            });
        }
    });
};

var updateInventory = function(ingredientId, quantity, res, next, callback) {
    Inventory.findOneAndUpdate({ingredientId: ingredientId}, {quantity: quantity}, function(err, obj) {
        if (err) return next(err);
        else {
            callback(err);
        }
    });
};

var processVendor = function(itemId, res, next) {
    Ingredient.find({}, function(err, ingredients){
        if (err) return next(err);
        else {
            for (var i = 0; i < ingredients.length; i++) {
                var currentIngredient = ingredients[i];
                var vendors = currentIngredient.vendors;
                for (var j = 0; j<vendors.length; j++) {
                    var vendor = vendors[j];
                    if (vendor.vendor.toString() == itemId.toString()) {
                        VendorPrice.find({_id: vendor._id}, function(err, obj) {
                            console.log(vendor._id);
                            console.log(obj);
                            if (err) return next(err);
                        });
                    }
                }
            }
        }
    });
}