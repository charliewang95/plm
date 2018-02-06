var User = require('mongoose').model('User');
var Cart = require('mongoose').model('Cart');
var Inventory = require('mongoose').model('Inventory');
var utils = require('../utils/utils');
var modifierCreateUpdate = require('../utils/modifierCreateUpdate');
var validator = require('../utils/validator');
var postProcessor = require('../utils/postProcessor');

exports.create = function(req, res, next) {
    utils.doWithAccess(req, res, next, Cart, 'create', req.params.userId, '', false);
}

exports.list = function(req, res, next) {
    utils.doWithAccess(req, res, next, Cart, 'listPartial', req.params.userId, '', false);
}

exports.read = function(req, res, next) {
	utils.doWithAccess(req, res, next, Cart, 'readWithUserAccess', req.params.userId, req.params.cartId, false);
};

exports.update = function(req, res, next) {
    utils.doWithAccess(req, res, next, Cart, 'updateWithUserAccess', req.params.userId, req.params.cartId, false);
};

exports.delete = function(req, res, next) {
	utils.doWithAccess(req, res, next, Cart, 'deleteWithUserAccess', req.params.userId, req.params.cartId, false);
};

exports.deleteAll = function(req, res, next) {
    deleteAllWithUserAccess(req, res, next, req.params.userId);
};

var deleteAllWithUserAccess = function(req, res, next, userId) {
    var errorMessage = '';
    Cart.find({userId: userId}, function(err, items) {
        if (err) {
            return next(err);
        } else if (items.length == 0) {
            res.status(400).send("Cart is empty");
        } else {
            //deleteAllHelper(preProcess, postProcess, model, items, res, next);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
//                validateCart(item, res, next, function(err, message, valid){
//                    if (err) {
//                        return next(err);
//                    }
//                    else if (valid) {
                        item.remove(function(err) {
                            if (err) return next(err);
                            else {
                                postProcessor.process(Cart, item, res, next);
                            };
                        });
            }
            res.json(items);
        }
    });
}
//                    }
//                    else {
//                        errorMessage += '/n'+message;
//                        if (i == items.length) {
//                            if (errorMessage == '')
//                                res.json(items);
//                            else
//                                res.json(errorMessage);
//                        }
//                    }
//                });
//            }
//        }
//    });
//};

var validateCart = function(item, res, next, callback) { //check if checked out items exceed inventory quantity
    var ingredientId = item.ingredientId;
    var quantity;
    console.log('validating '+ingredientId+' amount '+item.quantity);
    Inventory.findOne({ingredientId: ingredientId}, function(err, obj){
        if (err) return next(err);
        else if (!obj) {
            res.status(400);
            res.send("Ingredient doesn't exist in inventory");
        }
        else {
            quantity = obj.quantity;
            if (quantity < item.quantity) {
                console.log(invalid);
                var errorMessage = "Inventory limit -- "+quantity+" pounds is exceeded: please decrease amount of "+obj.ingredientName +'/n';
                callback(err, errorMessage, false);
            }
            else {
                console.log('valid');
                callback(err, errorMessage, true);
            }
        }
    });
};

function doSynchronousLoop(data, processData, done) {
	if (data.length > 0) {
		var loop = function(data, i, processData, done) {
			processData(data[i], i, function() {
				if (++i < data.length) {
					loop(data, i, processData, done);
				} else {
					done();
				}
			});
		};
		loop(data, 0, processData, done);
	} else {
		done();
	}
};

//var deleteAllHelper = function(func, callback, model, items, res, next) {
//    func(model, items, res, next, function(valid) {
//        if (valid) {
//            callback(model, items, res, next);
//        }
//        else {
//            res.status(400);
//            res.send("Something's wrong");
//        }
//    });
//};
//
//function preProcess(model, items, res, next, callback) {
//    var counter = 0;
//    for (var i = 0; i < items.length; i++) {
//        counter++;
//        var item = items[i];
//        validator.validate(model, item, res, next, function(err, valid){
//            if (err) {
//                return next(err);
//            }
//            else if (counter == items.length) {
//                console.log("got here");
//                callback(true);
//            }
//        });
//    }
//}
//
//function postProcess(model, items, res, next) {
//    for (var i = 0; i < items.length; i++) {
//        var item = items[i];
//        item.remove(function(err) {
//            if (err) return next(err);
//            else {
//                postProcessor.process(model, item, res, next, function(err){
//                    if (err) return next(err);
//                    else {
//                        if (i == items.length-1) {
//                            res.json(items);
//                        }
//                    }
//                });
//            }
//        });
//    }
//}