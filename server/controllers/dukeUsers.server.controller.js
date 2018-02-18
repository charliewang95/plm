// dukeUsers.server.controller.js
var DukeUser = require('mongoose').model('DukeUser');
var	passport = require('passport');
var utils = require('../utils/utils');


exports.create = function(req, res, next) {	
	utils.bypassAndDo(req, res, next, DukeUser, 'create', null);
};