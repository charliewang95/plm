var Ingredient = require('mongoose').model('Ingredient');
var User = require('mongoose').model('User');
var utils = require('../utils/utils');

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