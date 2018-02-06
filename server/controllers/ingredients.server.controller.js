var Ingredient = require('mongoose').model('Ingredient');
var Vendor = require('mongoose').model('Vendor');
var User = require('mongoose').model('User');
var utils = require('../utils/utils');
var fs = require('fs');
var Converter = require("csvtojson").Converter;
var converter = new Converter({});

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, Ingredient, 'create', req.params.userId, '', true);
};

exports.list = function(req, res, next) {
    utils.doWithAccess(req, res, next, Ingredient, 'list', req.params.userId, '', false);
};

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, Ingredient, 'read', req.params.userId, req.params.ingredientId, false);
};

exports.update = function(req, res, next) {
	utils.doWithAccess(req, res, next, Ingredient, 'update', req.params.userId, req.params.ingredientId, true);
};

exports.delete = function(req, res, next) {
    utils.doWithAccess(req, res, next, Ingredient, 'delete', req.params.userId, req.params.ingredientId, true);
};

exports.bulkImportIngredients = function(req, res, next, contents, callback) {
    console.log(contents);
    var jsonArray = [];
    const csv=require('csvtojson')
    csv({noheader:false})
    .fromString(contents)
    .on('json',(jsonObj)=>{
       jsonArray.push(jsonObj);
    })
    .on('done',()=>{
        console.log(jsonArray);
        convertBulkImport(req, res, next, jsonArray, 0, function(){
            res.send("Bulk import Success!");
            callback();
        })
    })
};

var convertBulkImport = function(req, res, next, array, i, callback){
    if (i == array.length)
        callback();
    //var counter = 0;
    //for (var i = 0; i < array.length; i++) {
        //counter++;
    else {
        var ingredient = array[i];
        console.log(ingredient);
        var ingredientName = ingredient.INGREDIENT.toLowerCase();
        var packageName = ingredient.PACKAGE.toLowerCase();
        var vendorCode = ingredient["VENDOR FREIGHT CODE"].toLowerCase();
        var vendorPrice = ingredient["PRICE PER PACKAGE"];
        var temperatureZone = '';

        if (ingredient.TEMPERATURE == 'room temperature') temperatureZone = 'warehouse';
        else if (ingredient.TEMPERATURE == 'frozen') temperatureZone = 'freezer';
        else if (ingredient.TEMPERATURE == 'refrigerated') temperatureZone = 'refrigerator';
        else res.status(400).send('Temperature "'+ingredient.TEMPERATURE+'" is not defined. Ingredients above this point are successfully loaded.');
        //console.log("processing "+ingredientName);

        Ingredient.findOne({name: ingredientName, packageName: packageName}, function(err, obj){
            console.log("processing "+ingredientName);
            console.log(obj);
            if (err) return next(err);
            else if (obj) {
                console.log("ingredient "+ingredientName+" already exists");
                if (obj.temperatureZone != temperatureZone) {
                    res.status(400).send('Action denied. Ingredient '+ingredientName+' can only be stored in '+obj.temperatureZone+'. Ingredients above this point are successfully loaded.');
                } else {
                    Vendor.findOne({codeUnique: vendorCode}, function(err, obj2){ //need to check if vendor already selling it
                        if (err) return next(err)
                        else if (!obj2) {
                            res.status(400).send('Actions denied. Vendor '+vendorCode+' does not exist. Ingredients above this point are successfully loaded.');
                        } else {
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
                            obj.update({vendors: vendors}, function(err, obj3){
                                if (err) return next(err);
                                console.log("new vendors");
                                console.log(vendors);
                                console.log("new ingredient");
                                console.log(obj);
                                convertBulkImport(req, res, next, array, i+1, callback)
                            })
                        }
                    });
                }
            }
            else {
                console.log("ingredient "+ingredientName+" does not exist");
                Vendor.findOne({codeUnique: vendorCode}, function(err, obj2){ //need to check if vendor already selling it
                    if (err) return next(err);
                    else if (!obj2) {
                        res.status(400).send('Actions denied. Vendor does not exist. Ingredients above this point are successfully loaded.');
                    } else {
                        var vendors = [];
                        var newVendor = new Object();
                        newVendor.codeUnique = vendorCode;
                        newVendor.vendorName = obj2.name;
                        newVendor.vendorId = obj2._id;
                        newVendor.price = Number(vendorPrice);
                        vendors.push(newVendor);

                        var newIngredient = new Ingredient();
                        newIngredient.name = ingredientName;
                        newIngredient.packageName = packageName;
                        newIngredient.temperatureZone = temperatureZone;
                        newIngredient.vendors = vendors;

                        console.log("new vendors");
                        console.log(vendors);
                        console.log("new ingredient");
                        console.log(newIngredient);

                        newIngredient.save(function(err){
                            if (err) return next(err);
                            convertBulkImport(req, res, next, array, i+1, callback);
                        });
                    }
                });


            }

//            if (counter == array.length) {
//                callback();
//            }
        });
    }
};