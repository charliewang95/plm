var Storage = require('mongoose').model('Storage');

var getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Storage name already exists';
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

exports.create = function(req, res, next) {
	var storage = new Storage(req.body);
	storage.save(function(err) {
		if (err) {
			return next(err);
		}
		else {
			res.json(storage);
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
	Storage.findByIdAndUpdate(req.storage.id, req.body, function(err, storage) {
		if (err) {
			return next(err);
		}
		else {
			res.json(storage);
		}
	});
};

exports.delete = function(req, res, next) {
	req.storage.remove(function(err) {
		if (err) {
			return next(err);
		}
		else {
			res.json(req.storage);
		}
	})
};