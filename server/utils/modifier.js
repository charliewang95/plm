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
    item = JSON.parse(str);

    var ingredients = item.ingredients;
    var fail = false;
    for (var i = 0; i < ingredients.length; i++) {
        var currentIngredient = ingredients[i];
        var ingredientId = currentIngredient.ingredient;
        Ingredient.findById(ingredientId, function(err, obj){
            if (err) return next(err);
            else if (!obj) {
                fail = true;
                res.status(400);
                res.send("Ingredient doesn't exist in inventory");
                return;
            }
            else {
                var vendors = obj.vendors;
                var newItem = new VendorPrice({vendor: item.name, price: currentIngredient.price});
                vendors.push(newItem);
                obj.update({vendors: vendors}, function(err2, obj2){
                    if (err2) return next(err2);
                });
            }
        });
    }
    if (!fail) {
        callback(0, item);
    }
};

//var modifyIngredient = function(item, res, next, callback) { //add unique lowercase code to check code uniqueness
//    var vendors = item.vendors;
//    var fail = false;
//    for (var i = 0; i < vendors.length; i++) {
//        var currentVendor = vendor[i];
//        var vendorName = currentVendor.ingredient;
//        Ingredient.findById(ingredientId, function(err, obj){
//            if (err) return next(err);
//            else if (!obj) {
//                fail = true;
//                res.status(400);
//                res.send("Ingredient doesn't exist in inventory");
//                return;
//            }
//            else {
//                var vendors = obj.vendors;
//                var newItem = new VendorPrice({vendor: item.name, price: currentIngredient.price});
//                vendors.push(newItem);
//                obj.update({vendors: vendors}, function(err2, obj2){
//                    if (err2) return next(err2);
//                });
//            }
//        });
//    }
//    if (!fail) {
//        callback(0, item);
//    }
//};