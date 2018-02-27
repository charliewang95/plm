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
        processVendor(item, itemId, res, next);
    }
    else if (model == Ingredient) {
        processIngredient(item, itemId, res, next);
    }
//    else if (model == Cart) {
//        processCart(item, res, next);
//    }
    else if (model == Storage) {
        processStorage(item, itemId, res, next);
    }
//    else if (model == Order) {
//        processOrder(item, res, next);
//    }
};



var processIngredient = function(item, itemId, res, next) {
    var oldItem = item;
    var oldTemperatureZone = item.temperatureZone;
    var oldSpace = oldItem.space;
    console.log(itemId);
    Ingredient.findById(itemId, function(err, newItem){
        var newSpace = newItem.space;
        var newTemperatureZone = newItem.temperatureZone;
        if (oldTemperatureZone == newTemperatureZone) {
            Storage.findOne({temperatureZone: newTemperatureZone}, function(err, storage){
                var capacity = storage.capacity;
                var occupied = storage.currentOccupiedSpace;
                var newOccupied = occupied - oldSpace + newSpace;
                var newEmpty = capacity - newOccupied;
                storage.update({currentOccupiedSpace: newOccupied, currentEmptySpace: newEmpty}, function(err, obj){
                    console.log(oldSpace+' '+newSpace);
                    if (err) return next(err);
                });
            });
        } else {
            Storage.findOne({temperatureZone: newTemperatureZone}, function(err, storage){
                var capacity = storage.capacity;
                var occupied = storage.currentOccupiedSpace;
                var newOccupied = occupied + newSpace;
                var newEmpty = capacity - newOccupied;
                storage.update({currentOccupiedSpace: newOccupied, currentEmptySpace: newEmpty}, function(err, obj){
                    console.log(oldSpace+' '+newSpace);
                    if (err) return next(err);
                    else {
                        Storage.findOne({temperatureZone: newTemperatureZone}, function(err, storage2){
                            var capacity2 = storage2.capacity;
                            var occupied2 = storage2.currentOccupiedSpace;
                            var newOccupied2 = occupied2 - oldSpace;
                            var newEmpty2 = capacity2 - newOccupied2;
                            storage2.update({currentOccupiedSpace: newOccupied2, currentEmptySpace: newEmpty2}, function(err, obj){
                                console.log(oldSpace2+' '+newSpace2);
                                if (err) return next(err);
                            });
                        });
                    }
                });
            });
        }
    });
};

var processCart = function(item, res, next) { //
    var ingredientId = item.ingredientId;
    var newSpace;
    Inventory.findOne({ingredientId: ingredientId}, function(err, obj){
        if (err) return next(err);
        else if (!obj) {
            res.status(400);
            res.send("Ingredient doesn't exist in inventory");
        }
        else {
            newSpace = obj.space - item.space;
            updateInventory(ingredientId, newSpace, res, next, function(err){
                if (err) return next(err);
                else {
                    updateIngredient(ingredientId, item.space, obj.space, res, next);
                }
            });
        }
    });
};

var updateInventory = function(ingredientId, newSpace, res, next, callback) {
    Inventory.findOneAndUpdate({ingredientId: ingredientId}, {space: newSpace}, function(err, obj) {
        if (err) return next(err);
        else if (newSpace == 0){
            obj.remove(function(err){
                callback(err);
            });
        }
        else {
            callback(err);
        }
    });
};

var updateIngredient = function(ingredientId, cartQuantity, oldQuantity, res, next) {
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


var processStorage = function(item, itemId, res, next) {
    console.log('changing empty space');
    var newLeft = item.capacity - item.currentOccupiedSpace;
    console.log(newLeft);
    Storage.findByIdAndUpdate(itemId, {currentEmptySpace: newLeft}, function(err, obj) {
        if (err) return next(err);
    });
};

var processVendor = function(item, itemId, res, next) {
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
                    if (vendor.vendorId.toString() === itemId) {
                        vendor.vendorName = item.name;
                    }
                    newVendors.push(vendor);
                }
                currentIngredient.update({vendors: newVendors}, function(err, obj){
                    if (err) return next(err);
                })
            }
        }
    });
}