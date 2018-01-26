var mongoose = require('mongoose');

exports.checkAdmin = function(req, res, next, id) {
    User.findOne({_id: id}, function(err, user) {
        if (err) { next(err); }

        else if (!user) {
            res.send("Admin required");
        }

        else if (!user.isAdmin) {
            res.send("Admin required");
        }

        else {
            next();
        }
    });
}