// dukeUsers.server.controller.js
var DukeUser = require('mongoose').model('DukeUser');
var	passport = require('passport');
var utils = require('../utils/utils');


exports.loggingInViaOAuth = function(req, res, next) {	
	DukeUser.findOne({username: req.body.username}, function(err, dukeUser){
        console.log(req.body);
        if (err) return next(err);
        else if (!dukeUser) {
            // res.status(400);
            // res.send("Username does not exist");
            utils.bypassAndDo(req, res, next, DukeUser, 'create', null);
        }
        else {
        	dukeUser.update({loggedIn: true,
        				 email: req.body.email}, function(err, obj){
        				 	res.json(dukeUser);
        				 })



            // if (user.authenticate(req.body.password)) {
            //     user.update({loggedIn: true}, function(err, obj){
            //         res.json(user);
            //     });
            // } else {
            //     res.status(400);
            //     res.send("Incorrect password.");
            // }
        }
    });
	
};