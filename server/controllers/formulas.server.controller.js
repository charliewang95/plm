var Ingredient = require('mongoose').model('Ingredient');
var Vendor = require('mongoose').model('Vendor');
var User = require('mongoose').model('User');
var Formula = require('mongoose').model('Formula');
var utils = require('../utils/utils');
var fs = require('fs');
var Converter = require("csvtojson").Converter;
var converter = new Converter({});
var bulkImport = require('../utils/bulkImportFormulas');

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, Formula, 'create', req.params.userId, '', true, true);
};

exports.list = function(req, res, next) {
    utils.doWithAccess(req, res, next, Formula, 'list', req.params.userId, '', false, false);
};

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, Formula, 'read', req.params.userId, req.params.formulaId, false, false);
};

exports.update = function(req, res, next) {
	utils.doWithAccess(req, res, next, Formula, 'update', req.params.userId, req.params.formulaId, true, true);
};

exports.delete = function(req, res, next) {
    utils.doWithAccess(req, res, next, Formula, 'delete', req.params.userId, req.params.formulaId, true, true);
};

exports.checkout = function(req, res, next) {
    utils.doWithAccess(req, res, next, Formula, 'checkoutFormula', req.params.userId, req.params.formulaId, false, true); //
};

exports.bulkImportFormulas = function(req, res, next, contents, callback) {
    bulkImport.bulkImportFormulas(req, res, next, contents, function() {
        //res.send(contents);
        callback();
    });
};