var Inventory = require('mongoose').model('Inventory');

var getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Inventory already exists';
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
	var inventory = new Inventory(req.body);
	inventory.save(function(err) {
		if (err) {
			return next(err);
		}
		else {
			res.json(inventory);
		}
	});
};

exports.list = function(req, res, next) {
	Inventory.find({}, function(err, inventorys) {
		if (err) {
			return next(err);
		}
		else {
			res.json(inventorys);
		}
	});
};

exports.read = function(req, res) {
	res.json(req.inventory);
};

exports.inventoryByID = function(req, res, next, id) {
	Inventory.findOne({
			_id: id
		},
		function(err, inventory) {
			if (err) {
				return next(err);
			}
			else {
				req.inventory = inventory;
				next();
			}
		}
	);
};

exports.update = function(req, res, next) {
	Inventory.findByIdAndUpdate(req.inventory.id, req.body, function(err, inventory) {
		if (err) {
			return next(err);
		}
		else {
			res.json(inventory);
		}
	});
};

exports.delete = function(req, res, next) {
	req.inventory.remove(function(err) {
		if (err) {
			return next(err);
		}
		else {
			res.json(req.inventory);
		}
	})
};