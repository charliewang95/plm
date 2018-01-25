var Inventory = require('mongoose').model('Inventory');
var utils = require('../utils/utils');

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
	Inventory.find({}, function(err, inventories) {
		if (err) {
			return next(err);
		}
		else {
			res.json(inventories);
		}
	});
};

exports.listPartial = function(req, res, next) {
	Inventory.find({userName: req.params.userName}, function(err, inventories) {
		if (err) {
			return next(err);
		}
		else {
			res.json(inventories);
		}
	});
};

exports.read = function(req, res) {
	Inventory.findOne({_id: req.params.inventoryName, userName: req.params.userName}, function(err, inventory) {
        if (err) {
            return next(err);
        }
        else {
            res.json(inventory);
        }
    });
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
	Inventory.findOne({_id: req.params.inventoryName, userName: req.params.userName}, function(err, inventory1) {
        if (err) {
            return next(err);
        }
        else {
            Order.findByIdAndUpdate(req.params.inventoryName, req.body, function(err, inventory2) {
                if (err) {
                    return next(err);
                }
                else {
                    res.json(inventory2);
                }
            });
        }
    });
};

exports.delete = function(req, res, next) {
	Inventory.findOne({_id: req.params.inventoryName, userName: req.params.userName}, function(err, inventory) {
        if (err) {
            return next(err);
        }
        else {
            inventory.remove(function(err) {
                if (err) {
                    return next(err);
                }
                else {
                    res.json(inventory);
                }
            })
        }
    });
};