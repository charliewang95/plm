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
//    else if (model == Ingredient) {
//        modifyIngredient(item, res, next, function(err, obj){
//            if (err) next(err);
//            else {
//                callback(err, obj);
//            }
//        });
//    }
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