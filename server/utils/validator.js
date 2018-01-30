var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Ingredient = mongoose.model('Ingredient');
var Storage = mongoose.model('Storage');
var Inventory = mongoose.model('Inventory');

exports.validate = function(model, item, res, next, callback) {
    if (model == Order) {
        validateOrder(item, res, next, function(err, obj){
            if (err) return next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else if (model == Storage) {
        validateStorage(item, res, next, function(err, obj){
            if (err) return next(err);
            else {
                callback(err, obj);
            }
        });
    }
};

var validateOrder = function(item, res, next, callback) { //check if exceed capacity
    var ingredientId = item.ingredientId;
    var ingredientName, temperatureZone, capacity, quantity, newQuantity;
    Ingredient.findById(ingredientId, function(err1, obj1){
        if (err1) return next(err1);
        else if (!obj1) {
            res.status(400);
            res.send("Ingredient doesn't exist");
        }
        else {
            ingredientName = obj1.name;
            temperatureZone = obj1.temperatureZone;
            Storage.findOne({ingredientId: ingredientId, temperatureZone: temperatureZone}, function(err2, obj2){
                if (err2) return next(err2);
                else if (!obj1) {
                    res.status(400);
                    res.send("Storage capacity needs to be set for ingredient "+ingredientId);
                }
                else {
                    capacity = obj2.capacity;
                    Inventory.findOne({ingredientId: ingredientId}, function(err3, obj3){
                        if (err3) return next(err3);
                        else if (!obj3) {
                            quantity = 0;
                        }
                        else {
                            quantity = obj3.quantity;
                        }

                        newQuantity = item.pounds + quantity;
                        if (newQuantity > capacity) {
                            res.status(400);
                            res.send("Capacity will be exceeded");
                        }
                        else {
                            updateInventory(ingredientId, ingredientName, temperatureZone, newQuantity, res, next, function(err4, obj4){
                                if (err4) return next(err4);
                                else {
                                    callback(err4, true);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

var updateInventory = function(ingredientId, ingredientName, temperatureZone, quantity, res, next, callback) {
    Inventory.findOneAndUpdate({ingredientId: ingredientId}, {quantity: quantity}, function(err, obj) {
        if (err) return next(err);
        else {
            var item = new Inventory();
                item.ingredientId = ingredientId;
                item.ingredientName = ingredientName;
                item.temperatureZone = temperatureZone;
                item.quantity = quantity;
                item.save(function(err) {
                    if (err) {
                        return next(err);
                    }
                    else {
                        callback(err, null);
                    }
                });
        }
    });
}

var validateStorage = function(item, res, next, callback) { //check if capacity below inventory quantity
    var ingredientId = item.ingredientId;
    var temperatureZoneUsed, capacity, quantity;
    Ingredient.findById(ingredientId, function(err1, obj1){
        if (err1) return next(err1);
        else if (!obj1) {
            res.status(400);
            res.send("Ingredient doesn't exist");
        }
        else {
            temperatureZoneUsed = obj.temperatureZone;
            if (temperatureZoneUsed.toLowerCase() == item.temperatureZone.toLowerCase()){
                Inventory.findOne({ingredientId: ingredientId}, function(err2, obj2){
                    if (err2) return next(err2);
                    else if (!obj2) {
                        quantity = 0;
                    }
                    else {
                        console.log(err2);
                        quantity = obj2.quantity;
                    }
                    if (item.capacity < quantity) {
                        res.status(400);
                        res.send("Capacity will be exceeded");
                    }
                    else {
                        callback(err2, true);
                    }
                });
            }
            else {
                callback(err1, true); // not stored at this temperature; change at will
            }
        }
    });
};