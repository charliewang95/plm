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
    console.log('checking out for '+userId);
    var errorMessage = '';
    Cart.find({userId: userId}, function(err, items) {
        console.log('cart items');
        console.log(items);
        if (err) {
            return next(err);
        } else if (items.length == 0) {
            res.status(400).send("Cart is empty");
        } else {
            //deleteAllHelper(preProcess, postProcess, model, items, res, next);
//            for (var i = 0; i < items.length; i++) {
//                var item = items[i];
//                validateCart(item, res, next, function(err, message, valid){
//                    if (err) {
//                        return next(err);
//                    }
//                    else if (valid) {
//                        item.remove(function(err) {
//                            if (err) return next(err);
//                            else {
//                                postProcessor.process(Cart, item, item._id, res, next);
//                                if ()
//                            };
//                        });
            deleteHelper(0, items, res, next, function(){
                res.json(items);
            })
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

var deleteHelper = function(i, items, res, next, callback) {
    if (i == items.length) {
        callback();
    } else {
        items[i].remove(function(err) {
            if (err) return next(err);
            else {
                postProcessor.process(Cart, items[i], items[i]._id, res, next);
                deleteHelper(i+1, items, res, next, callback);
            };
        });
    }
};

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
