var Ingredient = require('mongoose').model('Ingredient');
var IngredientLot = require('mongoose').model('IngredientLot');
var IngredientProduct = require('mongoose').model('IngredientProduct');
var IngredientFreshness = require('mongoose').model('IngredientFreshness');
var Vendor = require('mongoose').model('Vendor');
var User = require('mongoose').model('User');
var utils = require('../utils/utils');
var freshness = require('../utils/freshness');
var bulkImport = require('../utils/bulkImportIngredients');
var fs = require('fs');
var Converter = require("csvtojson").Converter;

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, Ingredient, 'create', req.params.userId, '', true, true);
};

exports.list = function(req, res, next) {
    utils.doWithAccess(req, res, next, Ingredient, 'list', req.params.userId, '', false, false);
};

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, Ingredient, 'read', req.params.userId, req.params.ingredientId, false, false);
};

exports.update = function(req, res, next) {
	utils.doWithAccess(req, res, next, Ingredient, 'update', req.params.userId, req.params.ingredientId, true, true);
};

exports.delete = function(req, res, next) {
    utils.doWithAccess(req, res, next, Ingredient, 'delete', req.params.userId, req.params.ingredientId, true, true);
};

exports.getOldestLot = function(req, res, next) {
    IngredientLot.find({ingredientId: req.params.ingredientId}, {},
               {sort: {date: 1} },function(err, lots){
        if (err) return next(err);
        else if (lots.length == 0) res.send(lots);
        else {
            res.send(lots[0]);
        }
    });
};

exports.listLotNumbers = function(req, res, next) {
    IngredientLot.find({ingredientId: req.params.ingredientId}, function(err, items){
//        var numberArray = [];
//        var numberUniqueArray = [];
//        for (var i = 0; i < items.length; i++) {
//            var lotNumber = items[i].lotNumber;
//            var lotNumberUnique = items[i].lotNumberUnique;
//            if (!numberUniqueArray.includes(lotNumberUnique)){
//                numberArray.push(lotNumber);
//                numberUniqueArray.push(lotNumberUnique);
//            }
//        }
//        res.send(numberArray);
        res.json(items);
    });
};

exports.editLot = function(req, res, next) {
    //var lotId = req.params.
};

exports.getRecall = function(req, res, next) {
    IngredientProduct.find({ingredientNameUnique: req.params.ingredientName.toLowerCase(), lotNumberUnique: req.params.lotNumber.toLowerCase()}, function(err, ingredients){
        if (err) return next(err);
        else res.json(ingredients);
    });
};

exports.listIngredients = function(req, res, next){
    Ingredient.find({isIntermediate: false}, function(err, items){
        if (err) return next(err);
        else res.send(items);
    });
};

exports.listIntermediate = function(req, res, next){
    Ingredient.find({isIntermediate: true}, function(err, items){
        if (err) return next(err);
        else res.send(items);
    });
};

exports.listNames = function(req, res, next) {
    Ingredient.aggregate([
        { "$project": {
            "_id": 0,
            "ingredientName": "$name"
        }}
    ], function(err, ingredients){
        res.json(ingredients);
    })
}

exports.getFresh = function(req, res, next) {
    freshness.getLatestInfo(res, next, req.params.ingredientName, function(){
        IngredientFreshness.find(function(err, fresh){
            if (err) return next(err);
            else return res.json(fresh);
        })
    });
}

exports.bulkImportIngredients = function(req, res, next, contents, callback) {
    bulkImport.bulkImportIngredients(req, res, next, contents, function() {
        //res.send(contents);
        callback();
    });
};

//
exports.editLot = function(req, res, next) {
    User.findById(req.params.userId, function(err, user){
        if (err) return next(err);
        else if (!user || !user.isAdmin) return res.status(400).send('Access denied');
        else {
            var lotId = req.params.lotId;
            var quantity = req.params.quantity;
            IngredientLot.findById(lotId, function(err, lot){
                if (err) return next(err);
                else if (!lot) return res.status(400).send('Lot not found');
                else {
                    var oldNumUnit = lot.numUnit;
                    var newNumUnit = quantity;
                    var numUnitDiff = newNumUnit - oldNumUnit;
                    Ingredient.findOne({nameUnique: lot.ingredientNameUnique}, function(err, ingredient){
                        if (numUnitDiff > 0) {
                            checkSpace(numUnitDiff, ingredient, lot, function(totalIncreasedSpace){
                                updateSpaceIncrease(lot, newNumUnit, oldNumUnit, totalIncreasedSpace, ingredient);
                            });
                        } else {
                            checkSpace(numUnitDiff, ingredient, lot, function(totalDecreasedSpace){
                                updateSpaceDecrease(lot, newNumUnit, oldNumUnit, totalDecreasedSpace, ingredient);
                            });
                        }
                    });
                }
            });
        }
    });
};

var checkSpace = function(numUnitDiff, ingredient, lot, callback) {
    Ingredient.getPackageSpace(ingredient.packageName, function(spacePerPackage){
        var totalChangedSpace = Math.ceil(numUnitDiff/ingredient.numUnitPerPackage)*spacePerPackage;
        if (numUnitDiff > 0) {
            Storage.findOne({temperatureZone: ingredient.temperatureZone}, function(err, storage){
                if (storage.currentEmptySpace < totalChangedSpace) return res.status(400).send('Action denied on lot '+lot.lotNumber+'. Storage limit '+storage.currentEmptySpace+' exceeded');
                else callback(totalChangedSpace);
            });
        } else {
            callback(totalChangedSpace);
        }
    });
};

var updateSpaceIncrease = function(lot, newNumUnit, oldNumUnit, totalIncreasedSpace, ingredient) {
    var diff = newNumUnit - oldNumUnit;
    lot.update({numUnit: newNumUnit}, function(err, obj){
        if (err) return next(err);
        else {
            var oldTotalNumUnit = ingredient.numUnit;
            var newTotalNumUnit = oldTotalNumUnit + diff;
            var oldSpace = ingredient.space;
            var newSpace = oldSpace + totalIncreasedSpace;
            ingredient.update({space: newSpace, numUnit: newTotalNumUnit}, function(err, obj2){
                if (err) return next(err);
                else {
                    Storage.findOne({temperatureZone: ingredient.temperatureZone}, function(err, storage){
                        var currentOccupiedSpace = storage.currentOccupiedSpace;
                        var currentEmptySpace = storage.currentEmptySpace;
                        var newCurrentOccupiedSpace = currentOccupiedSpace + totalIncreasedSpace;
                        var newCurrentEmptySpace = currentEmptySpace - totalIncreasedSpace;
                        storage.update({currentOccupiedSpace: newCurrentOccupiedSpace, currentEmptySpace:newCurrentEmptySpace}, function(err, obj3){
                            if (err) return next(err);
                            else return res.json(lot);
                        })
                    });
                }
            });
        }
    });
};

var updateSpaceDecrease = function(lot, newNumUnit, oldNumUnit, totalDecreasedSpace, ingredient) {
    var diff = oldNumUnit - newNumUnit;
    lot.update({numUnit: newNumUnit}, function(err, obj){
        if (err) return next(err);
        else {
            var oldTotalNumUnit = ingredient.numUnit;
            var newTotalNumUnit = oldTotalNumUnit - diff;
            var oldSpace = ingredient.space;
            var newSpace = oldSpace - totalDecreasedSpace;
            ingredient.update({space: newSpace, numUnit: newTotalNumUnit}, function(err, obj2){
                if (err) return next(err);
                else {
                    Storage.findOne({temperatureZone: ingredient.temperatureZone}, function(err, storage){
                        var currentOccupiedSpace = storage.currentOccupiedSpace;
                        var currentEmptySpace = storage.currentEmptySpace;
                        var newCurrentOccupiedSpace = currentOccupiedSpace - totalDecreasedSpace;
                        var newCurrentEmptySpace = currentEmptySpace + totalDecreasedSpace;
                        storage.update({currentOccupiedSpace: newCurrentOccupiedSpace, currentEmptySpace:newCurrentEmptySpace}, function(err, obj3){
                            if (err) return next(err);
                            else return res.json(lot);
                        })
                    });
                }
            });
        }
    });
};
