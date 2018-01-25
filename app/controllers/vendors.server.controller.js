var User = require('mongoose').model('User');
var Vendor = require('mongoose').model('Vendor');

var getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Vendor name already exists';
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
    User.findById(req.params.userName, function(err, user) {
        if (err) next(err);
        else if (!user) {
            res.send('403');
        }
        else if (!user.isAdmin) {
            res.send('403');
        }
        else {
            var vendor = new Vendor(req.body);
            vendor.save(function(err) {
                if (err) {
                    return next(err);
                }
                else {
                    res.json(vendor);
                }
            });
        }
    });
};

exports.list = function(req, res, next) {
    Vendor.find({}, function(err, vendors) {
        if (err) {
            return next(err);
        }
        else {
            res.json(vendors);
        }
    });
};

exports.read = function(req, res) {
	res.json(req.vendor);
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
	        Vendor.findByIdAndUpdate(req.params.vendorName, req.body, function(err, vendor) {
		        if (err) {
			        return next(err);
		        }
		        else {
			        res.json(vendor);
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
            Vendor.findById(req.params.vendorName, req.body, function(err, vendor) {
                if (err) {
                    return next(err);
                }
                else {
                    vendor.remove(function(err) {
                        if (err) {
                            return next(err);
                        }
                        else {
                            res.json(vendor);
                        }
                    })
                }
            });
        }
    });
};