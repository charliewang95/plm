var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Ingredient = mongoose.model('Ingredient');
var IngredientPrice = mongoose.model('IngredientPrice');
var Vendor = mongoose.model('Vendor');
var VendorPrice = mongoose.model('VendorPrice');
var Storage = mongoose.model('Storage');
var Log = mongoose.model('Log');

exports.log = function(username, action, item, model){
    var log = new Log();
    log.username = username;
    log.action = action;
    log.itemId = item._id.toString();
    log.model = model.collection.collectionName;
    log.date = new Date();

    if (model == User)
        log.item = item.username;
    else if (model == Inventory)
        log.item = item.ingredientName;
    else if (model == Cart)
        log.item = item.formulaName;
    else if (model == Storage)
        log.item = item.temperatureZone;
    else if (model == Order) {
        var ingredientId = item.ingredientId;
        Ingredient.findById(item.ingredientId, function(err, obj){
            if (err) return;
            log.item = item.temperatureZone;
            log.save(function(err){
                return;
            });
        });
    }
    else
        log.item = item.name;

    log.save(function(err){
        return;
    });
};