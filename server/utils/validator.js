var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Vendor = mongoose.model('Vendor');
var Ingredient = mongoose.model('Ingredient');
var Storage = mongoose.model('Storage');

exports.validate = function(model, itemId, item, res, next, callback) {
    console.log(item);
//    if (model == Order) {
//        validateOrders(item, res, next, function(){
//            callback();
//        });
//    }
    if (model == Storage) {
        validateStorage(item, res, next, function(err, obj){
            if (err) return next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else if (model == Cart) {
         validateCart(item, res, next, function(err, obj){
             if (err) return next(err);
             else {
                 callback(err, obj);
             }
         });
     }
     else if (model == Ingredient) {
          validateIngredient(itemId, item, res, next, function(err, obj){
              if (err) return next(err);
              else {
                  callback(err, obj);
              }
          });
      }
    else {
        callback(false, true);
    }
};

var validateStorage = function(item, res, next, callback) { //check if capacity below inventory quantity
    var capacity = item.capacity;
    if (capacity < item.currentOccupiedSpace)
        return res.status(400).send("Action denied. Capacity cannot be below current storage.");
    else
        callback(false, true);
};

var validateCart = function(item, res, next, callback) { //check if checked out items exceed inventory quantity
    var ingredientId = item.ingredientId;
    var quantity;
    Inventory.findOne({ingredientId: ingredientId}, function(err, obj){
        if (err) return next(err);
        else if (!obj) {
            res.status(400);
            res.send("Ingredient doesn't exist in inventory");
        }
        else {
            quantity = obj.quantity;
            if (quantity < item.quantity) {
                res.status(400);
                res.send("Inventory limit -- "+quantity+" pounds is exceeded: please decrease amount of "+obj.ingredientName);
            }
            else callback(err, true);
        }
    });
};

var validateIngredient = function(itemId, item, res, next, callback) { //check if ingredient haa vendors that doesn't exist
    console.log('validating ingredient '+item.name);
    console.log(item);
    var temperatureZone = item.temperatureZone;
    var space = item.space;
    Ingredient.findById(itemId, function(err, oldIngredient){
        var oldSpace = oldIngredient.space;
        Storage.findOne({temperatureZone: temperatureZone}, function(err, storage){
            var currentEmptySpace = storage.currentEmptySpace;
            if (space - oldSpace > currentEmptySpace) {
                return res.status(400).send('Action denied. New space cannot exceed current empty space '+currentEmptySpace+' for '+temperatureZone+'.');
            } else {
                callback(err, true);
            }
        });
    });
};