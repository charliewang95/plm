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
                else {
                    updateIngredient(ingredientId, item.quantity, obj.quantity, res, next, function(err, obj3){
                        if (err) return next(err);
                    });
                }
            });
        }
    });
};

var updateInventory = function(ingredientId, quantity, res, next, callback) {
    Inventory.findOneAndUpdate({ingredientId: ingredientId}, {quantity: quantity}, function(err, obj) {
        if (err) return next(err);
        else if (quantity == 0){
            obj.remove(function(err){
                callback(err);
            });
        }
        else {
            callback(err);
        }
    });
};

var updateIngredient = function(ingredientId, cartQuantity, oldQuantity, res, next, callback) {
    Ingredient.findById(ingredientId, function(err, ingredient){
        if (err) return next(err);
        else if (!ingredient) {
            res.status(400);
            res.send("Ingredient doesn't exist");
        }
        else {
            var moneyProd = ingredient.moneyProd;
            var moneySpent = ingredient.moneySpent;
            var newMoneyProd = moneyProd+1.0*cartQuantity*(moneySpent-moneyProd)/oldQuantity;
            //console.log(newMoneyProd);
            ingredient.update({moneyProd: newMoneyProd}, function(err, obj){
                if (err) return next(err);
            });
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
                var newVendors = [];
                for (var j = 0; j<vendors.length; j++) {
                    var vendor = vendors[j];
                    console.log(vendor);
                    if (vendor.vendorId.toString() !== itemId) {
                        newVendors.push(vendor);
//                        VendorPrice.find({_id: vendor._id}, function(err, obj) {
//                            console.log(vendor._id);
//                            console.log(obj);
//                            if (err) return next(err);
//                        });
                    }
                }
                currentIngredient.update({vendors: newVendors}, function(err, obj){
                    if (err) return next(err);
                })
            }
        }
    });
}