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
    if (model == Ingredient) {
        processIngredient(item, itemId, res, next);
    }
    else if (model == Vendor) {
        processVendor(itemId, res, next);
    } else {
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
        storage.update({currentOccupiedSpace: occupied, currentEmptySpace:empty}, function(err, obj){});
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