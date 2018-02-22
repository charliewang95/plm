var Ingredient = require('mongoose').model('Ingredient');
var Vendor = require('mongoose').model('Vendor');
var User = require('mongoose').model('User');
var Storage = require('mongoose').model('Storage');
var utils = require('../utils/utils');
var fs = require('fs');
var Converter = require("csvtojson").Converter;

exports.bulkImportIngredients = function(req, res, next, contents, callback) {
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
            doBulkImport(req, res, next, jsonArray, 0, function(){
                callback();
            });
        })
    })
};

var validateBulkImport = function(req, res, next, array, i, callback){
    if (i == array.length)
        callback();
    else {
        var ingredient = array[i];
        //console.log(ingredient);
        var ingredientName = ingredient.INGREDIENT;
        var packageName = ingredient.PACKAGE.toLowerCase();
        var vendorCode = ingredient["VENDOR FREIGHT CODE"].toLowerCase();
        var vendorPrice = ingredient["PRICE PER PACKAGE"];
        var amount = ingredient["AMOUNT (LBS)"];
        var temperatureZone = ingredient.TEMPERATURE.toLowerCase();

        if (ingredientName == null || ingredientName == '') res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Ingredient name cannot be empty');
        if (packageName == null || packageName == '') res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Package name cannot be empty');
        if (vendorPrice == null || vendorPrice <= 0) res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Price cannot be empty or zero');
        if (amount == null || amount < 0) amount = 0;
        if (temperatureZone == null || temperatureZone == '') res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Temperature zone cannot be empty');

        if (temperatureZone == 'room temperature') temperatureZone = 'warehouse';
        else if (temperatureZone == 'frozen') temperatureZone = 'freezer';
        else if (temperatureZone == 'refrigerated') temperatureZone = 'refrigerator';
        else res.status(400).send('Temperature "'+ingredient.TEMPERATURE+'" is not defined.');
        //console.log("processing "+ingredientName);

        Ingredient.findOne({name: ingredientName}, function(err, obj){
            console.log("processing "+ingredientName);
            console.log(obj);
            if (err) return next(err);
            else if (obj) {
                console.log("ingredient "+ingredientName+" already exists");
                if (obj.temperatureZone != temperatureZone) {
                    res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Ingredient '+ingredientName+' can only be stored in '+obj.temperatureZone+'.');
                }
            }
            else {
                console.log("ingredient "+ingredientName+" does not exist");
            }

            if (vendorCode == null || vendorCode == '') {
                Storage.findOne({temperatureZone: temperatureZone}, function(err, obj3){
                    if (err) return next(err);
                    else {
                        if (obj3.currentEmptySpace < amount && packageName!='railcar' && packageName!='truckload') res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Storage limit '+obj3.currentEmptySpace+' left for '+temperatureZone+' would be exceeded.');
                        else validateBulkImport(req, res, next, array, i+1, callback)
                    }
                });
            } else {
                Vendor.findOne({codeUnique: vendorCode}, function(err, obj2){ //need to check if vendor already selling it
                    if (err) return next(err)
                    else if (!obj2) {
                        res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Vendor '+vendorCode+' does not exist.');
                    } else {
                        Storage.findOne({temperatureZone: temperatureZone}, function(err, obj3){
                            if (err) return next(err);
                            else {
                                if (obj3.currentEmptySpace < amount && packageName!='railcar' && packageName!='truckload') res.status(400).send('Action denied on item '+(i+1)+' ('+ingredientName+'). Storage limit '+obj3.currentEmptySpace+' left for '+temperatureZone+' would be exceeded.');
                                else validateBulkImport(req, res, next, array, i+1, callback)
                            }
                        });
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
        var ingredient = array[i];
        //console.log(ingredient);
        var ingredientName = ingredient.INGREDIENT;
        var packageName = ingredient.PACKAGE.toLowerCase();
        var vendorCode = ingredient["VENDOR FREIGHT CODE"].toLowerCase();
        var vendorPrice = ingredient["PRICE PER PACKAGE"];
        var amount = ingredient["AMOUNT (LBS)"];
        var temperatureZone = ingredient.TEMPERATURE.toLowerCase();

        if (ingredientName == null || ingredientName == '') res.status(400).send('Ingredient name cannot be empty');
        if (packageName == null || packageName == '') res.status(400).send('Package name cannot be empty');
        if (vendorPrice == null || vendorPrice <= 0) res.status(400).send('Price cannot be empty or zero');
        if (amount == null || amount < 0) amount = 0;
        if (temperatureZone == null || temperatureZone == '') res.status(400).send('Temperature zone cannot be empty');

        if (temperatureZone == 'room temperature') temperatureZone = 'warehouse';
        else if (temperatureZone == 'frozen') temperatureZone = 'freezer';
        else if (temperatureZone == 'refrigerated') temperatureZone = 'refrigerator';
        else res.status(400).send('Temperature "'+ingredient.TEMPERATURE+'" is not defined.');
        //console.log("processing "+ingredientName);

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
    //                        console.log("new vendors");
    //                        console.log(vendors);
    //                        console.log("new ingredient");
    //                        console.log(obj);
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
    //
    //                    console.log("new vendors");
    //                    console.log(vendors);
    //                    console.log("new ingredient");
    //                    console.log(newIngredient);
    //                    newIngredient = JSON.parse(JSON.stringify(newIngredient).slice(0,-1)+',"nameUnique":"'+ingredientName.toLowerCase()+'"}');

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