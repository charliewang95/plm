var Storage = require('mongoose').model('Storage');
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
            var storage = new Storage(req.body);
            storage.save(function(err) {
                if (err) {
                    return next(err);
                }
                else {
                    res.json(storage);
                }
            });
        }
    });
};

exports.list = function(req, res, next) {
	Storage.find({}, function(err, storages) {
		if (err) {
			return next(err);
		}
		else {
			res.json(storages);
		}
	});
};

exports.read = function(req, res) {
	res.json(req.storage);
};

exports.storageByID = function(req, res, next, id) {
	Storage.findOne({
			_id: id
		},
		function(err, storage) {
			if (err) {
				return next(err);
			}
			else {
				req.storage = storage;
				next();
			}
		}
	);
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
            Storage.findByIdAndUpdate(req.params.storageName, req.body, function(err, storage) {
                if (err) {
                    return next(err);
                }
                else {
                    res.json(storage);
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
            Storage.findById(req.params.storageName, req.body, function(err, storage) {
                if (err) {
                    return next(err);
                }
                else {
                    storage.remove(function(err) {
                        if (err) {
                            return next(err);
                        }
                        else {
                            res.json(storage);
                        }
                    })
                }
            });
        }
    });
};