var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Ingredient = mongoose.model('Ingredient');
var IngredientFreshness = mongoose.model('IngredientFreshness');
var IngredientProduct = mongoose.model('IngredientProduct');
var IngredientLot = mongoose.model('IngredientLot');
var Vendor = mongoose.model('Vendor');
var VendorPrice = mongoose.model('VendorPrice');
var Storage = mongoose.model('Storage');

exports.process = function(model, item, itemId, res, next) {
    if (model == Ingredient) {
        processIngredient(item, itemId, res, next);
    }
    else if (model == Vendor) {
        processVendor(itemId, res, next);
    }
    else if (model == Order) {
        processOrder(item, res, next);
    }
    else {
        return;
    }
};

var processIngredient = function(item, itemId, res, next) {
    var space = item.space;
    var temperatureZone = item.temperatureZone;
    Storage.findOne({temperatureZone: temperatureZone}, function(err, storage){
        var capacity = storage.capacity;
        var occupied = storage.currentOccupiedSpace - space;
        var empty = capacity - occupied;
        storage.update({currentOccupiedSpace: occupied, currentEmptySpace:empty}, function(err, obj){
            IngredientFreshness.findOne({ingredientNameUnique: item.nameUnique}, function(err, ingredientFreshness){
                if (err) return next(err);
                else if (!ingredientFreshness) return;
                else {
                    ingredientFreshness.remove(function(err){
                        IngredientProduct.remove({ingredientNameUnique: item.nameUnique}, function(err, obj){
                            IngredientLot.remove({ingredientNameUnique: item.nameUnique}, function(err, obj){

                            });
                        });
                    });
                }
            })
        });
    })
};

//var processVendor = function(item, itemId, res, next) {
//    Ingredient.find({}, function(err, ingredients){
//         deleteIngredientVendorHelper(0, item, ingredients, res, next, function(){
//
//         });
//    });
//};
//
//var deleteIngredientVendorHelper = function(i, vendor, ingredients, res, next, callback) {
//    if (i == ingredients.length)
//        callback();
//    else {
//        var ingredient = ingredients[i];
//        var vendors = ingredient.vendors;
//        var newVendors = [];
//        for (var j = 0; j < vendors.length; j++) {
//            if (vendors[j].vendorName.toLowerCase() != vendor.name.toLowerCase()) {
//                newVendors.push(vendor[j]);
//            }
//        }
//        ingredient.update({vendors: newVendors}, function(err, obj){
//            if (err) return next(err);
//            else {
//                deleteIngredientVendorHelper(i+1, vendor, ingredients, res, next, callback);
//            }
//        });
//    }
//};


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
};

var processOrder = function(items, res, next) {
    processOrderHelper(0, items, res, next);
};

var processOrderHelper = function(i, items, res, next) {
    if (i == items.length) {
        return;
    } else {
        var order = items[i];
        Ingredient.findOne({nameUnique: order.ingredientName.toLowerCase()}, function(err, ingredient){
            var newSpace = ingredient.space + order.space;
            var numUnit = ingredient.numUnit + order.numUnit;
            var moneySpent = ingredient.moneySpent + order.totalPrice;
            ingredient.update({numUnit: numUnit, space: newSpace, moneySpent: moneySpent}, function(err, obj){
                if (err) return next(err);
//                order.remove(function(err){
//                    if (err) return next(err);
                    else processOrderHelper(i+1, items, res, next);
//                });
            });
        })
    }
};