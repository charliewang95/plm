var Order = require('mongoose').model('Order');

var getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Order already exists';
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
	var order = new Order(req.body);
	order.save(function(err) {
		if (err) {
			return next(err);
		}
		else {
			res.json(order);
		}
	});
};

exports.list = function(req, res, next) {
	Order.find({}, function(err, orders) {
		if (err) {
			return next(err);
		}
		else {
			res.json(orders);
		}
	});
};

exports.read = function(req, res) {
	res.json(req.order);
};

exports.orderByID = function(req, res, next, id) {
	Order.findOne({
			_id: id
		},
		function(err, order) {
			if (err) {
				return next(err);
			}
			else {
				req.order = order;
				next();
			}
		}
	);
};

exports.update = function(req, res, next) {
	Order.findByIdAndUpdate(req.order.id, req.body, function(err, order) {
		if (err) {
			return next(err);
		}
		else {
			res.json(order);
		}
	});
};

exports.delete = function(req, res, next) {
	req.order.remove(function(err) {
		if (err) {
			return next(err);
		}
		else {
			res.json(req.order);
		}
	})
};