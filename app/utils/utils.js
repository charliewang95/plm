var mongoose = require('mongoose');
var User = require('mongoose').model('Vendor');

exports.checkAdmin = function(req, res, next, id) {
    User.find({_id: id}, function(err, user) {
        if (err) { next(err); }

        else if (!user) {
            res.status(403).send(user);
        }

        else if (!user.isAdmin) {
            res.status(403).send();
        }

        else {
            next();
        }
    });
}