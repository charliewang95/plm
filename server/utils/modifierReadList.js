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
    if (model == Ingredient) {
        modifyIngredient(item, res, next, function(err, obj){
            if (err) return next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else callback(false, item);
};

var modifyIngredient(item, res, next, callback) {

}

