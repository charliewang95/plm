var User = require('mongoose').model('User');
var	passport = require('passport');
var utils = require('../utils/utils');

exports.renderLogin = function(req, res, next) {
	if (!req.user) {
		res.render('login', {
			title: 'Log-in Form',
			messages: req.flash('error') || req.flash('info')
		});
	}
	else {
		return res.redirect('/');
	}
};

exports.renderRegister = function(req, res, next) {
	if (!req.user) {
		res.render('register', {
			title: 'Register Form',
			messages: req.flash('error')
		});
	}
	else {
		return res.redirect('/');
	}
};

exports.register = function(req, res, next) {
	if (!req.user) {
	    console.log("here");
		var user = new User(req.body);
		console.log(user);
		user.save(function(err) {
			if (err) {
				//var message = getErrorMessage(err);
				//req.flash('error', message);
				return res.redirect('/register');
			}	

			req.login(user, function(err) {
				if (err) 
					return next(err);
				return res.redirect('/');
			});
		});
	}
	else {
		return res.redirect('/');
	}
};

exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};

exports.saveOAuthUserProfile = function(req, profile, done) {
	User.findOne({
			provider: profile.provider,
			providerId: profile.providerId
		},
		function(err, user) {
			if (err) {
				return done(err);
			}
			else {
				if (!user) {
					var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');
					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						profile.username = availableUsername;
						user = new User(profile);

						user.save(function(err) {
							if (err) {
								var message = _this.getErrorMessage(err);
								req.flash('error', message);
								return res.redirect('/register');
							}

							return done(err, user);
						});
					});
				}
				else {
					return done(err, user);
				}
			}
		}
	);
};


exports.create = function(req, res, next) {	
	utils.doWithAccess(req, res, next, User, 'create', req.params.userId, '', true);
};

exports.list = function(req, res, next) {
	utils.doWithAccess(req, res, next, User, 'list', req.params.userId, '', true);
};

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, User, 'read', req.params.userId, req.params.searchedUserId, true);
};

exports.update = function(req, res, next) {
	utils.doWithAccess(req, res, next, User, 'update', req.params.userId, req.params.searchedUserId, true);
};

exports.delete = function(req, res, next) {
	utils.doWithAccess(req, res, next, User, 'delete', req.params.userId, req.params.searchedUserId, true);
};

//var getUsernameById(userId) {
//    User.findById(userId, function(err, item){
//        if (err)
//    });
//}