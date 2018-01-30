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
    var temperatureZone, capacity, quantity;
    Ingredient.findById(ingredientId, function(err1, obj){
        if (err1) return next(err1);
        else {
            temperatureZone = obj.temperatureZone;
            Storage.findOne({ingredientId: ingredientId, temperatureZone: temperatureZone}, function(err2, obj){
                if (err2) return next(err2);
                else {
                    capacity = obj.capacity;
                    Inventory.findOne({ingredientId: ingredientId}, function(err3, obj2){
                        if (err3) return next(err3);
                        else {
                            quantity = obj2.quantity;
                            if (item.pounds + quantity > capacity) {
                                res.status(400);
                                res.send("Capacity will be exceeded");
                            }
                            else {
                                callback(err3, true);
                            }
                        }
                    });
                }
            });
        }
    });
};

var validateStorage = function(item, res, next, callback) { //check if capacity below inventory quantity
    var ingredientId = item.ingredientId;
    var temperatureZoneUsed, capacity, quantity;
    Ingredient.findById(ingredientId, function(err1, obj){
        if (err1) return next(err1);
        else {
            temperatureZoneUsed = obj.temperatureZone;
            if (temperatureZoneUsed.toLowerCase() == item.temperatureZone.toLowerCase()){
                Inventory.findOne({ingredientId: ingredientId}, function(err, obj){
                    if (err) return next(err);
                    else {
                        quantity = obj.quantity;
                        if (item.capacity < quantity) {
                            res.status(400);
                            res.send("Capacity will be exceeded");
                        }
                        else {
                            callback(err, true);
                        }
                    }
                });
            }
            else {
                callback(err1, true); // not stored at this temperature; change at will
            }
        }
    });
};