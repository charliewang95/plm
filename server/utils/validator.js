var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Vendor = mongoose.model('Vendor');
var Ingredient = mongoose.model('Ingredient');
var Storage = mongoose.model('Storage');
var Inventory = mongoose.model('Inventory');
var Cart = mongoose.model('Cart');

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

var validateOrder = function(item, res, next, callback) { //check if exceed capacity
    var ingredientId = item.ingredientId;
    var ingredientName, temperatureZone, capacity;
    var space = 0, newSpace = 0, oldSpace = 0, oldNumUnit = 0;
    Ingredient.findById(ingredientId, function(err1, obj1){
        if (err1) return next(err1);
        else if (!obj1) {
            res.status(400);
            res.send("Ingredient doesn't exist");
        }
        else {
            ingredientName = obj1.name;
            temperatureZone = obj1.temperatureZone;
            Storage.findOne({temperatureZone: temperatureZone}, function(err2, storage){
                if (err2) return next(err2);
                else if (!obj1) {
                    res.status(400);
                    res.send("Storage capacity needs to be set for "+temperatureZone);
                }
                else {
                    capacity = storage.capacity;
                    Inventory.find({temperatureZone: temperatureZone}, function(err3, inventories){
                        if (err3) return next(err3);
                        else if (!inventories) {
                            space = 0;
                        }
                        else {
                            for (var i=0; i<inventories.length; i++) {
                                if (inventories[i].packageName != 'truckload' && inventories[i].packageName != 'railcar')
                                    space+=inventories[i].space;
                                if (inventories[i].ingredientId.toString() == ingredientId.toString()) {
                                    oldSpace = inventories[i].space;
                                    oldNumUnit = inventories[i].numUnit;
                                }
                            }
                        }

                        newSpace = item.space + space;
                        if (newSpace > capacity && obj1.packageName != 'truckload' && obj1.packageName != 'railcar') {
                            res.status(400);
                            res.send("Capacity -- "+capacity+" pounds will be exceeded. Your existed storage is "+quantity+" pounds.");
                        }
                        else {
                            updateInventory(ingredientId, oldSpace+item.space, oldNumUnit+item.numUnit, res, next, function(err4, obj4){
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

var updateInventory = function(ingredientId, space, numUnit, res, next, callback) {
    Inventory.findOneAndUpdate({ingredientId: ingredientId}, {space: space, numUnit: numUnit}, function(err, obj) {
        if (err) return next(err);
        else if (!obj){
            if (space == 0) callback(0, null);
            else {
                Ingredient.findById(ingredientId, function(err, ingredient){
                    if (err) return next(err);
                    else if (!ingredient) {
                        res.status(400).send("Ingredient does not exist");
                    }
                    else {
                        var item = new Inventory();
                        item.ingredientId = ingredientId;
                        item.ingredientName = ingredient.name;
                        item.temperatureZone = ingredient.temperatureZone;
                        item.packageName = ingredient.packageName;
                        item.space = space;
                        item.nativeUnit = ingredient.nativeUnit;
                        item.numUnit = numUnit;
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
        }
        else {
            if (space == 0 && obj.packageName != 'truckload' && obj.packageName != 'railcar') {
                obj.remove(func);
            }
            else {
                callback(err, null);
            }
        }
    });
}

var validateStorage = function(item, res, next, callback) { //check if capacity below inventory quantity
    //var ingredientId = item.ingredientId;
    var temperatureZone = item.temperatureZone;
    var temperatureZoneUsed, capacity, quantity = 0;
    Inventory.find({temperatureZone: temperatureZone}, function(err1, items){
        if (err1) return next(err1);
        else if (!item) {
            res.status(400);
            res.send("Ingredient doesn't exist");
        }
        else {
            for (var i = 0; i < items.length; i++) {
                var inventory = items[i];
//                temperatureZoneUsed = storage.temperatureZone;
//                if (temperatureZoneUsed.toLowerCase() == item.temperatureZone.toLowerCase()){
//                    Inventory.findOne({ingredientId: ingredientId}, function(err2, obj2){
//                        if (err2) return next(err2);
//                        else if (!obj2) {
//                            quantity = 0;
//                        }
//                        else {
//                            console.log(err2);
//                            quantity = obj2.quantity;
//                        }
                if (inventory.packageName != 'truckload' && inventory.packageName != 'railcar')
                    quantity+=inventory.quantity;
            }
            if (item.capacity < quantity) {
                res.status(400);
                res.send("Capacity -- "+item.capacity+" will be exceeded by current quantity "+ quantity +" for "+temperatureZone);
            }
//                    });
//                }
//                else {
//                    callback(err1, true); // not stored at this temperature; change at will
//                }
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
    var quantity = item.quantity;
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
            var currentQuantity = 0;
            Inventory.find({temperatureZone: temperatureZone}, function(err, items){
                for (var i = 0; i < items.length; i++) {
                    var inventory = items[i];
                    if (inventory.packageName != 'truckload' && inventory.packageName != 'railcar')
                        currentQuantity+=inventory.quantity;
                    if (inventory.ingredientId == ingredientId && inventory.packageName == packageName)
                        currentQuantity-=inventory.quantity;
                }
                var newQuantity = 0;
                newQuantity = quantity + currentQuantity;
                if (capacity < newQuantity) {
                    res.status(400);
                    res.send("Capacity -- "+capacity+" will be exceeded by current quantity "+ newQuantity +" for "+temperatureZone);
                }
                else callback(err, true);
            })

        }
    })
};
