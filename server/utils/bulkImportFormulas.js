var Ingredient = require('mongoose').model('Ingredient');
var Formula = require('mongoose').model('Formula');
var Vendor = require('mongoose').model('Vendor');
var User = require('mongoose').model('User');
var Storage = require('mongoose').model('Storage');
var utils = require('../utils/utils');
var fs = require('fs');
var Converter = require("csvtojson").Converter;

var prevFormula = '';
var allFormulas = [];

exports.bulkImportFormulas = function(req, res, next, contents, callback) {
    //console.log(contents);
    var jsonArray = [];
    const csv=require('csvtojson')
    csv({noheader:false})
    .fromString(contents)
    .on('json',(jsonObj)=>{
       jsonArray.push(jsonObj);
    })
    .on('done',()=>{
//          console.log(jsonArray);
        validateBulkImport(req, res, next, jsonArray, 0, function(){
            res.send("Bulk import Success!");
            //do bulk import
//            doBulkImport(req, res, next, jsonArray, 0, function(){
//                res.send("Bulk import Success!");
//                callback();
//            });
        })
    })
};

var validateBulkImport = function(req, res, next, array, i, callback){
    if (i == array.length) {
        formulaName = '';
        callback();
    }
    else {
        var formula = array[i];
        //console.log(formula);
        var formulaName = formula.FORMULA;
        var unitsProvided = formula["PRODUCT UNITS"];
        var description = formula.DESCRIPTION;
        var ingredientNameUnique = formula.INGREDIENT.toLowerCase();
        var ingredientUnits = formula["INGREDIENT UNITS"];

        if (formulaName == null || formulaName == '') {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Formula name cannot be empty');
            return;
        }
        if (unitsProvided == null || unitsProvided <= 0) {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Units provided cannot be empty or zero');
            return;
        }
        if (ingredientName == null || ingredientName == '') {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Ingredient name cannot be empty');
            return;
        }
        if (ingredientUnits == null || ingredientUnits <= 0) {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Ingredient units cannot be empty or zero');
            return;
        }
        if (!Number.isInteger(unitsProvided)) {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Units provided must be an integer.');
            return;
        }

        Formula.findOne({nameUnique: formulaName.toLowerCase()}, function(err, obj){
            if (err) return next(err);
            else if (obj) {
                res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Formula already exists');
                return;
            }
            else {
                Ingredient.findOne({nameUnique: ingredientNameUnique}, function(err, obj) {
                    if (err) return next(err);
                    else if (!obj) {
                        res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Ingredient does not exist.');
                        return;
                    }
                    else {
                        if (formulaName.toLowerCase() != prevFormula && allFormulas.includes(formulaName.toLowerCase())){
                            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Duplicate formula names exist (the same formula should be in consecutive rows).');
                            return;
                        } else {
                            prevFormula = formulaName.toLowerCase();
                            validateBulkImport(req, res, next, array, i+1, callback);
                        }
                    }
                });
            }
        });
    }
};

var doBulkImport = function(req, res, next, array, i, callback){
    if (i == array.length)
        callback();
    else {
        var formula = array[i];
        //console.log(formula);
        var formulaName = formula.FORMULA;
        var unitsProvided = formula["PRODUCT UNITS"];
        var description = formula.DESCRIPTION;
        var ingredientName = formula.INGREDIENT;
        var ingredientUnits = formula["INGREDIENT UNITS"];
        var ingredient = new Object();
        ingredient.ingredientName = ingredientName;
        ingredient.quantity = amount;

        Formula.findOne({nameUnique: formulaName.toLowerCase()}, function(err, obj){
            if (err) next(err);
            else if (obj) {
                console.log('Formula '+formulaName+' exists');
                var ingredients = obj.ingredients;
                ingredients.push(ingredient);
                obj.update({vendors: vendors, nameUnique:ingredientName.toLowerCase()}, function(err, obj3){
                    if (err) return next(err);
                    doBulkImport(req, res, next, array, i+1, callback);
                })

            } else {
                console.log('Formula '+formulaName+' does not exist yet');
                var ingredients = [];
                ingredients.push(ingredient);
                var newFormula = new Formula();
                newFormula.name = formulaName;
                newFormula.nameUnique = formulaName.toLowerCase();
                newFormula.description = description;
                newFormula.unitsProvided = unitsProvided;
                newFormula.ingredients = ingredients;

                newFormula.save(function(err){
                    if (err) return next(err);
                    doBulkImport(req, res, next, array, i+1, callback);
                });
            }
        });






        Ingredient.findOne({name: ingredientName}, function(err, obj){
            console.log("processing "+ingredientName);
            console.log(obj);
            if (err) return next(err);
            else if (obj) {
                console.log("ingredient "+ingredientName+" already exists");
                if (vendorCode != null && vendorCode != '') {
                    Vendor.findOne({codeUnique: vendorCode}, function(err, obj2){ //need to check if vendor already selling it
                        var vendors = obj.vendors;
                        if (vendors == null || vendors.length == 0)
                            vendors = [];
                        console.log("old vendors");
                        console.log(vendors);
                        var newVendor = new Object();
                        newVendor.codeUnique = vendorCode;
                        newVendor.vendorName = obj2.name;
                        newVendor.vendorId = obj2._id;
                        newVendor.price = Number(vendorPrice);
                        vendors.push(newVendor);
                        obj.update({vendors: vendors, nameUnique:ingredientName.toLowerCase()}, function(err, obj3){
                            if (err) return next(err);
                            doBulkImport(req, res, next, array, i+1, callback);
                        })
                    });
                }
            }
            else {
                console.log("ingredient "+ingredientName+" does not exist");
                if (vendorCode != null && vendorCode != '') {
                    Vendor.findOne({codeUnique: vendorCode}, function(err, obj2){ //need to check if vendor already selling it
                        var vendors = [];
                        var newVendor = new Object();
                        newVendor.codeUnique = vendorCode;
                        newVendor.vendorName = obj2.name;
                        newVendor.vendorId = obj2._id;
                        newVendor.price = Number(vendorPrice);
                        vendors.push(newVendor);

                        var newIngredient = new Ingredient();
                        newIngredient.name = ingredientName;
                        newIngredient.nameUnique = ingredientName.toLowerCase();
                        newIngredient.packageName = packageName;
                        newIngredient.temperatureZone = temperatureZone;
                        newIngredient.vendors = vendors;
                        newIngredient.save(function(err){
                            if (err) return next(err);
                            doBulkImport(req, res, next, array, i+1, callback);
                        });
                    });
                } else {
                    var newIngredient = new Ingredient();
                    newIngredient.name = ingredientName;
                    newIngredient.nameUnique = ingredientName.toLowerCase();
                    newIngredient.packageName = packageName;
                    newIngredient.temperatureZone = temperatureZone;
                    newIngredient.vendors = [];

                    newIngredient.save(function(err){
                        if (err) return next(err);
                        doBulkImport(req, res, next, array, i+1, callback);
                    });
                }
            }
        });
    }
};