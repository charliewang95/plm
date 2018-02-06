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
    else callback(false, item);
};

var modifyOrder = function(item, res, next, callback) { //add number of pounds to order
    Order.getNumPounds(item.ingredientId, item.packageNum, res, next, function(err, pounds){
        if (err) {
            return next(err);
        }
        else {
            var str = JSON.stringify(item).slice(0,-1)+',"pounds":'+pounds+'}';
            var price;
            var fail = true;
            Ingredient.findById(item.ingredientId, function(err, ingredient){
                if (err) return next(err);
                else {
                    var vendors = ingredient.vendors;
                    for (var i = 0; i < vendors.length; i++) {
                        var vendor = vendors[i];
                        if (vendor.vendorId.toString() === item.vendorId.toString()) {
                            fail = false;
                            price = vendor.price;
                            str = str.slice(0,-1)+',"price":'+price+',"totalPrice":'+price*pounds+'}';
                            moneySpent = ingredient.moneySpent;
                            ingredient.update({moneySpent: moneySpent + price*pounds}, function(err, obj) {
                                if (err) return next(err);
                                else {
                                    callback(err, JSON.parse(str));
                                }
                            });
                        }
                    }
                    if (fail)
                        res.status(400).send("Vendor doesn't sell this ingredient or vendor doesn't exist");
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
    var counter = 0;
    var vendors = item.vendors;
    var newVendors = [];
    for (var i = 0; i<vendors.length; i++) {
        counter++;
        var vendor = vendors[i];
        Vendor.findOne({codeUnique: vendor.codeUnique.toLowerCase()}, function(err, obj){
            if (err) next(err);
            else if (!obj) {
                res.send('Vendor '+vendor.codeUnique+' does not exist.');
            }
            else {
                var str = JSON.stringify(vendor).slice(0,-1)+',"vendorName":"'+obj.name+'","vendorId":"'+obj._id+'"}';
                newVendor = JSON.parse(str);
                newVendors.push(newVendor);
                if (counter == vendors.length) {
                    item.vendors = newVendors;
                    callback(0, item);
                }
            }
        });
    }
};