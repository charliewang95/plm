var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Ingredient = mongoose.model('Ingredient');
var IngredientPrice = mongoose.model('IngredientPrice');
var Vendor = mongoose.model('Vendor');
var VendorPrice = mongoose.model('VendorPrice');
var Storage = mongoose.model('Storage');
var Formula = mongoose.model('Formula');

exports.validate = function(model, item, res, next, callback) {
    if (model == Ingredient) {
        validateIngredient(item, res, next, function(err, obj){
            if (err) return next(err);
            else {
                callback();
            }
        });
    }
    else if (model == Vendor) {
        validateVendor(item, res, next, function(err, obj){
            if (err) next(err);
            else {
                callback(err, obj);
            }
        });
    }
    else callback();
};

var validateIngredient = function(item, res, next, callback) {
    var ingredientName = item.name;
    var formulaString = '';
    Formula.find({}, function(err, formulas){
        for (var i = 0; i < formulas.length; i++){
            for (var j = 0; j < formulas[i].ingredients.length; j++){
                if (ingredientName.toLowerCase() == formulas[i].ingredients[j].ingredientName.toLowerCase()){
                    formulaString+=formulas[i].name+', ';
                }
            }
        }
        if (formulaString!='')
            return res.status(400).send('Action denied. This ingredient is used in formula(s): '+formulaString.slice(0,-2));
        else
            callback();
    })
};

var validateVendor = function(item, res, next, callback) {
    var vendorName = item.name;
    var ingredientString = '';
    Ingredient.find({}, function(err, ingredients){
        for (var i = 0; i < ingredients.length; i++){
            for (var j = 0; j < ingredients[i].vendors.length; j++){
                if (vendorName.toLowerCase() == ingredients[i].vendors[j].vendorName.toLowerCase()){
                    ingredientString+=ingredients[i].name+', ';
                }
            }
        }
        if (ingredientString!='') {
            return res.status(400).send('Action denied. This vendor is used in ingredient(s): '+ingredientString.slice(0,-2));
        }
        else
            callback();
    });
};