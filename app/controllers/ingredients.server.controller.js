var Ingredient = require('mongoose').model('Ingredient');
var User = require('mongoose').model('User');
var utils = require('../utils/utils');

exports.create = function(req, res, next) {
    User.findById(req.params.userName, function(err, user) {
        if (err) next(err);
        else if (!user) {
            res.send('403');
        }
        else if (!user.isAdmin) {
            res.send('403');
        }
        else {
            var ingredient = new Ingredient(req.body);
            ingredient.save(function(err) {
                if (err) {
                    return next(err);
                }
                else {
                    res.json(ingredient);
                }
            });
        }
    });
};

exports.list = function(req, res, next) {
	Ingredient.find({}, function(err, ingredients) {
		if (err) {
			return next(err);
		}
		else {
			res.json(ingredients);
		}
	});
};

exports.read = function(req, res) {
	res.json(req.ingredient);
};

exports.update = function(req, res, next) {
	User.findById(req.params.userName, function(err, user) {
        if (err) next(err);
        else if (!user) {
            res.send('403');
        }
        else if (!user.isAdmin) {
            res.send('403');
        }
        else {
            Ingredient.findByIdAndUpdate(req.params.ingredientName, req.body, function(err, ingredient) {
                if (err) {
                    return next(err);
                }
                else {
                    res.json(ingredient);
                }
            });
        }
    });
};

exports.delete = function(req, res, next) {
	User.findById(req.params.userName, function(err, user) {
        if (err) next(err);
        else if (!user) {
            res.send('403');
        }
        else if (!user.isAdmin) {
            res.send('403');
        }
        else {
            Ingredient.findById(req.params.ingredientName, req.body, function(err, ingredient) {
                if (err) {
                    return next(err);
                }
                else {
                    ingredient.remove(function(err) {
                        if (err) {
                            return next(err);
                        }
                        else {
                            res.json(ingredient);
                        }
                    })
                }
            });
        }
    });
};