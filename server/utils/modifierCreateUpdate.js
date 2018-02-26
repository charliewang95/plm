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
var Formula = mongoose.model('Formula');

exports.modify = function(action, model, item, itemId, res, next, callback) {
    if (model == Order) {
        modifyOrder(item, res, next, function(err, obj){
            if (err) return next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else if (model == Vendor) {
        modifyVendor(action, item, itemId, res, next, function(err, obj){
            if (err) next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else if (model == Ingredient) {
        modifyIngredient(action, item, itemId, res, next, function(err, obj){
            if (err) next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else if (model == Formula) {
        modifyFormula(action, item, itemId, res, next, function(err, obj){
            if (err) next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else callback(false, item);
};

var modifyOrder = function(item, res, next, callback) { //add number of pounds to order
    var num = item.packageNum;
    Order.getNumSpaceAndNumUnits(item.ingredientName, item.packageNum, res, next, function(err, space, numUnit){
        if (err) {
            return next(err);
        }
        else {
            Ingredient.findOne({nameUnique: item.ingredientName.toLowerCase()}, function(err, ingredient){
                if (err) return next(err);
                else if (!ingredient){
                    return res.status(400).send('Ingredient does not exist');
                } else {
                    var str = JSON.stringify(item).slice(0,-1)+',"space":'+space+',"numUnit":'+numUnit+',"totalPrice":'+item.price*item.packageNum+',"ingredientId":"'+ingredient._id+'"}';
                    callback(err, JSON.parse(str));
                }
            });
        }
    });
};

var modifyVendor = function(action, item, itemId, res, next, callback) { //add unique lowercase code to check code uniqueness
    var code = item.code.toLowerCase();
    var str = JSON.stringify(item).slice(0,-1)+',"codeUnique":"'+code+'"}';
    item = JSON.parse(str);
    var counter1 = 0;
    // delete old ingredient vendor info
//    if (action == 'delete' || action == 'update') {
//        Vendor.findById(itemId, function(err, obj) {
//            if (err) return next(err);
//            else {
//                var ingredients = obj.ingredients;
//                for (var i = 0; i < ingredients.length; i++) {
//                    var currentIngredient = ingredients[i];
//                    var ingredientId = currentIngredient.ingredient;
//                    counter1++;
//                    Ingredient.findById(ingredientId, function(err, obj2){
//                        if (err) return next(err);
//                        else if (obj2){
//                            var vendors = obj2.vendors;
//                            var vendorExist = false;
//                            for (var j=0; j<vendors.length; j++) {
//                                var vendor = vendors[j];
//                                if (vendor.vendor == item.name) {
//                                    vendors.splice(j,1);
//                                    break;
//                                }
//                            }
//                            console.log('delete on'+obj2);
//
//                            obj2.update({vendors: vendors}, function(err2, obj3){
//
//                                if (err2) return next(err2);
//                                else if (counter1 == ingredients.length) {
//                                    console.log("got here");
//                                    counter1 = -1;
//                                    if (action == 'create' || action == 'update') {
//                                        var ingredients2 = item.ingredients;
//                                        var counter2 = 0;
//                                        for (var k = 0; k < ingredients.length; k++) {
//                                            var currentIngredient = ingredients2[k];
//                                            var ingredientId = currentIngredient.ingredient;
//                                            counter2++;
//                                            Ingredient.findById(ingredientId, function(err, obj4){
//                                                if (err) return next(err);
//                                                else if (!obj4) {
//                                                    res.status(400);
//                                                    res.send("Ingredient doesn't exist in inventory");
//                                                    return;
//                                                }
//                                                else {
//                                                    var vendors = obj4.vendors;
//                                                    var vendorExist = false;
//                                                    for (var l=0; l<vendors.length; l++) {
//                                                        var vendor = vendors[l];
//                                                        if (vendor.vendor == item.name) {
//                                                            vendor.price = currentIngredient.price;
//                                                            vendorExist = true;
//                                                            break;
//                                                        }
//                                                    }
//                                                    if (!vendorExist) {
//                                                        var newItem = new VendorPrice({vendor: item.name, price: currentIngredient.price});
//                                                        vendors.push(newItem);
//                                                    }
//                                                    console.log('create on'+obj4);
//                                                    obj4.update({vendors: vendors}, function(err2, obj5){
//                                                        if (err2) return next(err2);
//                                                        else if (counter2 == ingredients2.length) {
//                                                            counter2 = -1;
//                                                            return callback(0, item);
//                                                        }
//                                                    });
//                                                }
//                                            });
//                                        }
//                                    }
//                                }
//                            });
//                        }
//                    });
//                }
//            }
//        });
//    }

    return callback(0, item);

};

var modifyIngredient = function(action, item, itemId, res, next, callback) {
    var vendors = item.vendors;
    var ingredientName = item.name;
    var str = JSON.stringify(item).slice(0,-1)+',"nameUnique":"'+ingredientName.toLowerCase()+'"}';
    item = JSON.parse(str);
    if (vendors == null || vendors.length == 0){
        callback(0, item);
    } else {
        var newVendors = [];
        helperIngredient(vendors, 0, res, next, newVendors, function(err, obj){
            item.vendors = obj;
            callback(0, item);
        })
    }
};

var helperIngredient = function(vendors, i, res, next, array, callback) {
    if (i == vendors.length) {
        callback(0, array);
    } else {
        vendor = vendors[i];
//        console.log(vendor);
        var newVendor;
        Vendor.findOne({name: vendor.vendorName}, function(err, obj){
            if (err) next(err);
            else if (!obj) {
                res.send('Vendor '+vendor.vendorName+' does not exist.');
            }
            else {
//                console.log(i);
//                console.log(vendor);
                var str = JSON.stringify(vendor).slice(0,-1)+',"codeUnique":"'+obj.codeUnique+'","vendorId":"'+obj._id+'"}';
                newVendor = JSON.parse(str);
                array.push(newVendor);

                helperIngredient(vendors, i+1, res, next, array, callback);
            }
        });
    }
};

var modifyFormula = function(action, item, itemId, res, next, callback) { //add unique lowercase code to check code uniqueness
    var str = JSON.stringify(item).slice(0,-1)+',"nameUnique":"'+item.name.toLowerCase()+'"}';
    item = JSON.parse(str);
    var ingredients = item.ingredients;
    if (ingredients == null || ingredients.length == 0){
        callback(0, item);
    } else {
        var newIngredients = [];
//        helperFormula(ingredients, 0, res, next, newIngredients, function(err, obj){
//            item.ingredients = obj;
//            callback(0, item);
//        })
        callback(0, item);
    }

};

var helperFormula = function(ingredients, i, res, next, array, callback) {
    if (i == ingredients.length) {
        callback(0, array);
    } else {
        ingredient = ingredients[i];
//        console.log(vendor);
        var newIngredient;
        Ingredient.findOne({name: ingredient.ingredientName}, function(err, obj){
            if (err) next(err);
            else if (!obj) {
                res.send('Ingredient '+ingredient.ingredientName+' does not exist.');
            }
            else {
//                console.log(i);
//                var str = JSON.stringify(ingredient).slice(0,-1)+',"ingredientId":"'+obj._id+'"}';
//                newIngredient = JSON.parse(str);
//                array.push(newIngredient);
//                console.log(newIngredient);
                helperFormula(ingredients, i+1, res, next, array, callback);
            }
        });
    }
};