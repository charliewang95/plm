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

exports.modify = function(model, item, itemId, res, next, callback) {
    if (model == Vendor) {
        modifyVendor(item, res, next, function(err, obj){
            if (err) return next(err);
            else {
                callback(err, obj);
            }
        });
    }
//    else if (model == Ingredient) {
//        modifyIngredient(item, res, next, function(err, obj){
//            if (err) next(err);
//            else {
//                callback(err, obj);
//            }
//        });
//    }
    else callback(false, item);
};

var modifyVendor = function(item, res, next, callback) {
    Ingredient.find({}, function(err, ingredients){
        if (err) return next(err);
        else {
            for (var i = 0; i<ingredients.length; i++) {
                var currentIngredient = ingredients[i];
                if (currentIngredient.vendor)
            }
        }
    })


    for (var i = 0; i < ingredients.length; i++) {
        var currentIngredient = ingredients[i];
        var ingredientId = currentIngredient.ingredient;
        Ingredient.findById(ingredientId, function(err, obj){ // update related ingredients' vendor list
            if (err) return next(err);
            else if (!obj) {
                fail = true;
                res.status(400);
                res.send("Ingredient doesn't exist in inventory");
                return;
            }
            else {
                var vendors = obj.vendors;
                var vendorExist = false;
                for (var j=0; j<vendors.length; j++) {
                    var vendor = vendors[j];
                    if (vendor.vendor == item.name) {
                        vendor.price = currentIngredient.price;
                        vendorExist = true;
                        break;
                    }
                }
                if (!vendorExist) {
                    var newItem = new VendorPrice({vendor: item.name, price: currentIngredient.price});
                    vendors.push(newItem);
                }
                obj.update({vendors: vendors}, function(err2, obj2){
                    if (err2) return next(err2);
                });
            }
        });
    }
    if (!fail) {
        callback(0, item);
    }
}