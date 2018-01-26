var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Ingredient already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    }
    else {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }

    return message;
};

exports.doWithAccess = function(req, res, next, model, action, userId, itemId, AdminRequired) {
    User.findById(userId, function(err, user) {
        if (err) next(err);
        else if (!user) {
            res.send('403');
        }
        else if (AdminRequired && !user.isAdmin) {
            res.send('403');
        }
        else {
            if (action == 'create') create(req, res, next, model);
            else if (action == 'list') list(req, res, next, model);
            else if (action == 'listPartial') listPartial(req, res, next, model, userId);
            else if (action == 'update') update(req, res, next, model, itemId);
            else if (action == 'updateWithUserAccess') update(req, res, next, model, userId, itemId);
            else if (action == 'delete') deleteWithoutUserAccess(req, res, next, model, itemId);
            else if (action == 'deleteWithUserAccess') deleteWithUserAccess(req, res, next, model, userId, itemId);
            else if (action == 'read') read(req, res, next, model, itemId);
            else if (action == 'readWithUserAccess') readWithUserAccess(req, res, next, model, userId, itemId);
            else res.send('403');
        }
    });
}

var list = function(req, res, next, model) {
	model.find({}, function(err, items) {
		if (err) {
			return next(err);
		}
		else {
			res.json(items);
		}
	});
};

var listPartial = function(req, res, next, model, itemId) {
	model.find({userId: itemId}, function(err, items) {
		if (err) {
			return next(err);
		}
		else {
			res.json(items);
		}
	});
};

var create = function(req, res, next, model) {
	var item = new model(req.body);
	item.save(function(err) {
		if (err) {
			return next(err);
		}
		else {
			res.json(item);
		}
	});
};

var read = function(req, res, next, model, itemId) {
    model.findById(itemId, function(err, item) {
        if (err) {
            return next(err);
        }
        else {
            res.json(item);
        }
    });
};

var readWithUserAccess = function(req, res, next, model, userId, itemId) {
    model.findOne({_id: itemId, userId: userId}, function(err, item) {
        if (err) {
            return next(err);
        }
        else {
            res.json(item);
        }
    });
};

var update = function(req, res, next, model, itemId) {
    model.findByIdAndUpdate(itemId, req.body, function(err, item) {
        if (err) {
            return next(err);
        }
        else {
            res.json(item);
        }
    });
};

var updateWithUserAccess = function(req, res, next, model, userId, itemId) {
    model.findOne({_id: itemId, userId: userId}, function(err, item1) {
        if (err) {
            return next(err);
        }
        else {
            model.findByIdAndUpdate(itemId, req.body, function(err, item2) {
                if (err) {
                    return next(err);
                }
                else {
                    res.json(item2);
                }
            });
        }
    });
};

var deleteWithoutUserAccess = function(req, res, next, model, itemId) {
    model.findOne({_id: itemId}, req.body, function(err, item) {
        if (err) {
            return next(err);
        }
        else {
            item.remove(function(err) {
                if (err) {
                    return next(err);
                }
                else {
                    res.json(item);
                }
            })
        }
    });
};

var deleteWithUserAccess = function(req, res, next, model, userId, itemId) {
    Inventory.findOne({_id: itemId, userId: userId}, function(err, item) {
        if (err) {
            return next(err);
        }
        else {
            item.remove(function(err) {
                if (err) {
                    return next(err);
                }
                else {
                    res.json(item);
                }
            })
        }
    });
}