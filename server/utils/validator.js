var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Vendor = mongoose.model('Vendor');
var Ingredient = mongoose.model('Ingredient');
var Storage = mongoose.model('Storage');
var Inventory = mongoose.model('Inventory');
var Cart = mongoose.model('Cart');

exports.validate = function(model, item, res, next, callback) {
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
//     else if (model == Ingredient) {
//          validateIngredient(item, res, next, function(err, obj){
//              if (err) return next(err);
//              else {
//                  callback(err, obj);
//              }
//          });
//      }
      else if (model == Inventory) {
             validateInventory(item, res, next, function(err, obj){
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
    var temperatureZone = item.temperatureZone;
    var temperatureZoneUsed, capacity, space = 0;
    Inventory.find({temperatureZone: temperatureZone}, function(err1, items){
        if (err1) return next(err1);
        else if (!item) {
            res.status(400);
            res.send("Ingredient doesn't exist");
        }
        else {
            for (var i = 0; i < items.length; i++) {
                var inventory = items[i];
                if (inventory.packageName != 'truckload' && inventory.packageName != 'railcar')
                    space+=inventory.space;
            }
            if (item.capacity < space) {
                res.status(400);
                res.send("Capacity -- "+item.capacity+" sqft will be exceeded by current space "+ space +" sqft for "+temperatureZone);
            }
            else callback(err1, true);
        }
    });
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

var validateIngredient = function(item, res, next, callback) { //check if ingredient haa vendors that doesn't exist
    console.log('validating ingredient '+item.name);
    console.log(item);
    var vendors = item.vendors;
    var counter = 0;
    if (vendors == null || vendors.length == 0) {
        callback(0, true);
    } else {
        for (var i = 0; i<vendors.length; i++) {

            var vendor = vendors[i];
            Vendor.findOne({codeUnique: vendor.codeUnique.toLowerCase()}, function(err, obj){
                if (err) return next(err);
                else if (!obj){
                    res.status(400);
                    res.send('Vendor '+vendor.codeUnique+' does not exist.');
                    callback(err, false);
                }
                else if (counter == vendors.length) {
                    callback(err, true);
                }
            })
        }
    }
};

var validateInventory = function(item, res, next, callback) { //check if ingredient haa vendors that doesn't exist
    var ingredientId = item.ingredientId;
    var space = item.space;
    var packageName = item.packageName;
    var temperatureZone = item.temperatureZone;
    var capacity;
    Storage.findOne({temperatureZone: temperatureZone}, function(err, storage){
        if (err) return next(err);
        else if (!storage) {
            res.status(400);
            res.send("Storage capacity needs to be set for "+temperatureZone);
        }
        else {
            var capacity = storage.capacity;
            var currentSpace = 0;
            Inventory.find({temperatureZone: temperatureZone}, function(err, items){
                for (var i = 0; i < items.length; i++) {
                    var inventory = items[i];
                    if (inventory.packageName != 'truckload' && inventory.packageName != 'railcar')
                        currentSpace+=inventory.space;
                    if (inventory.ingredientId == ingredientId && inventory.packageName == packageName)
                        currentSpace-=inventory.space;
                }
                var newSpace = 0;
                newSpace = space + currentSpace;
                if (capacity < newSpace) {
                    res.status(400);
                    res.send("Capacity -- "+capacity+" sqft will be exceeded by current quantity "+ newQuantity +" sqft for "+temperatureZone);
                }
                else callback(err, true);
            })

        }
    })
};
