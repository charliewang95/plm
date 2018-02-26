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
            //do bulk import
            doBulkImport(req, res, next, jsonArray, 0, function(){
                res.send("Bulk import Success!");
                callback();
            });
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
        var formulaName = formula.NAME;
        var unitsProvided = formula["PRODUCT UNITS"];
        var description = formula.DESCRIPTION;
        var ingredientName = formula.INGREDIENT;
        var ingredientNameUnique = formula.INGREDIENT.toLowerCase();
        var ingredientUnits = formula["INGREDIENT UNITS"];

        if (formulaName == null || formulaName == '') {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Formula name cannot be empty');
            return;
        }
        if (formulaName.toLowerCase() != prevFormula.toLowerCase() && (unitsProvided == null || unitsProvided <= 0)) {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Units provided cannot be empty or zero');
            return;
        }
        if (ingredientNameUnique == null || ingredientNameUnique == '') {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Ingredient name cannot be empty');
            return;
        }
        if (ingredientUnits == null || ingredientUnits <= 0) {
            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Ingredient units cannot be empty or zero');
            return;
        }
        if (Number(unitsProvided)%1!=0) {
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
                        res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Ingredient '+formula.INGREDIENT+' does not exist.');
                        return;
                    }
                    else {
                        if (formulaName.toLowerCase() != prevFormula && allFormulas.includes(formulaName.toLowerCase())){
                            res.status(400).send('Action denied on item '+(i+1)+' ('+formulaName+'). Duplicate formula names exist (the same formula should be in consecutive rows).');
                            return;
                        } else if (formulaName.toLowerCase() != prevFormula) {
                            prevFormula = formulaName.toLowerCase();
                            allFormulas.push(formulaName.toLowerCase());
                        }
                        validateBulkImport(req, res, next, array, i+1, callback);
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
        var formulaName = formula.NAME;
        var unitsProvided = formula["PRODUCT UNITS"];
        var description = formula.DESCRIPTION;
        var ingredientName = formula.INGREDIENT;
        var ingredientUnits = formula["INGREDIENT UNITS"];
        var ingredient = new Object();
        ingredient.ingredientName = ingredientName;
        ingredient.quantity = ingredientUnits;

        Formula.findOne({nameUnique: formulaName.toLowerCase()}, function(err, obj){
            if (err) next(err);
            else if (obj) {
                console.log('Formula '+formulaName+' exists');
                var ingredients = obj.ingredients;
                ingredients.push(ingredient);
                obj.update({ingredients: ingredients}, function(err, obj3){
                    if (err) return next(err);
                    else doBulkImport(req, res, next, array, i+1, callback);
                });
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
                    else doBulkImport(req, res, next, array, i+1, callback);
                });
            }
        });
    }
};