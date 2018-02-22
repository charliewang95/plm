var Ingredient = require('mongoose').model('Ingredient');
var Vendor = require('mongoose').model('Vendor');
var User = require('mongoose').model('User');
var utils = require('../utils/utils');
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

exports.bulkImportIngredients = function(req, res, next, contents, callback) {
    bulkImport.bulkImportIngredients(req, res, next, contents, function() {
        //res.send(contents);
        callback();
    });
};