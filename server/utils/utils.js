var mongoose = require('mongoose');
var User = mongoose.model('User');
var Log = mongoose.model('Log');
var Storage = mongoose.model('Storage');
var Ingredient = mongoose.model('Ingredient');
var modifierCreateUpdate = require('./modifierCreateUpdate');
//var modifierDelete = require('./modifierDelete');
var validator = require('./validator');
var postProcessor = require('./postProcessor');
var logger = require('./logger');

exports.doWithAccess = function(req, res, next, model, action, userId, itemId, AdminRequired, ManagerRequired) {
    User.findById(userId, function(err, user) {
        if (err) next(err);
        else if (!user) {
            res.status(401);
            res.send('User does not exist');
        }
        else if (!user.loggedIn) {
            res.status(403);
            res.send('User is not logged in');
        }
        else if (AdminRequired && !user.isAdmin) {
            res.status(403);
            res.send('Admin access required');
        }
        else if (ManagerRequired && !user.isManager) {
            res.status(403);
            res.send('Manager access required');
        }
        else {
            if (action == 'create') create(req, res, next, model, user.username);
            else if (action == 'list') list(req, res, next, model, user.username);
            else if (action == 'listPartial') listPartial(req, res, next, model, userId, user.username);
            else if (action == 'update') update(req, res, next, model, itemId, user.username);
            else if (action == 'updateWithUserAccess') updateWithUserAccess(req, res, next, model, userId, itemId, user.username);
            else if (action == 'delete') deleteWithoutUserAccess(req, res, next, model, itemId, user.username);
            else if (action == 'deleteWithUserAccess') deleteWithUserAccess(req, res, next, model, userId, itemId, user.username);
            else if (action == 'deleteAllWithUserAccess') deleteAllWithUserAccess(req, res, next, model, userId);
            else if (action == 'read') read(req, res, next, model, itemId, user.username);
            else if (action == 'readWithUserAccess') readWithUserAccess(req, res, next, model, userId, itemId, user.username);
            else {
                res.status(400);
                res.send('Something went wrong');
            }
        }
    });
}

var list = function(req, res, next, model, username) {
	model.find({}, function(err, items) {
		if (err) {
			return next(err);
		}
		else {
			res.json(items);
		}
	});
};

var listPartial = function(req, res, next, model, itemId, username) {
	model.find({userId: itemId}, function(err, items) {
		if (err) {
			return next(err);
		}
		else {
			res.json(items);
		}
	});
};

var create = function(req, res, next, model, username) {
	var item = new model(req.body);
	console.log(req.body);
	var modifiedItem;
	console.log("creating, modifying");
    modifierCreateUpdate.modify('create', model, item, '', res, next, function(err, obj){
        if (err) {
            return next(err);
        }
        else if (obj){
            console.log("creating, modified");
            console.log("creating, validating");
            modifiedItem = new model(obj);
            console.log(modifiedItem);
            validator.validate(model, modifiedItem, res, next, function(err, valid){
                if (err) {
                    return next(err);
                }
                else if (valid) {
                    console.log("creating, validated");
                    console.log("creating, saving");
                    modifiedItem.save(function(err) {
                        if (err) {
                            return next(err);
                        }
                        else {
                            console.log("creating, saved");
                            logger.log(username, 'create', modifiedItem, model);
                            res.json(modifiedItem);
                        }
                    });
                }
            });
        }
        else {
            res.status(400);
            res.send("Object doesn't exist");
        }
    });
};

var read = function(req, res, next, model, itemId, username) {
    model.findById(itemId, function(err, item) {
        if (err) {
            return next(err);
        }
        else {
            res.json(item);
        }
    });
};

var readWithUserAccess = function(req, res, next, model, userId, itemId, username) {
    model.findOne({_id: itemId, userId: userId}, function(err, item) {
        if (err) {
            return next(err);
        }
        else {
            res.json(item);
        }
    });
};

var update = function(req, res, next, model, itemId, username) {
    console.log("updating, modifying");
    modifierCreateUpdate.modify('update', model, req.body, itemId, res, next, function(err, obj){
        if (err) {
            return next(err);
        }
        else if (obj) {
            console.log("updating, modified");
            console.log("updating, validating");
            validator.validate(model, obj, res, next, function(err, valid){
                if (err) {
                    return next(err);
                }
                else if (valid) {
                    console.log("updating, validated");
                    console.log("updating, updating");
                    model.findByIdAndUpdate(itemId, obj, function(err, obj2) {
                        if (err) {
                            return next(err);
                        }
                        else if (obj2){
                            console.log("updating, updated");
                            logger.log(username, 'update', obj, model);
                            if (model == Storage) {
                                postProcessor.process(model, obj, itemId, res, next);
                            }
                            res.json(obj2);
                        } else {
                            res.status(400);
                            res.send("Object doesn't exist");
                        }
                    });
                }
            });
        }
        else {
             res.status(400);
             res.send("Object doesn't exist");
        }
    });
};

var updateWithUserAccess = function(req, res, next, model, userId, itemId, username) {
    model.findOne({_id: itemId, userId: userId}, function(err, obj) {
        if (err) {
            return next(err);
        }
        else if (obj) {
            modifierCreateUpdate.modify('update', model, req.body, itemId, res, next, function(err, obj){
                if (err) {
                    return next(err);
                }
                else if (obj) {
                    console.log("updating, modified");
                    console.log("updating, validating");
                    validator.validate(model, obj, res, next, function(err, valid){
                        if (err) {
                            return next(err);
                        }
                        else if (valid) {
                            console.log("updating, validated");
                            console.log("updating, updating");
                            model.findByIdAndUpdate(itemId, obj, function(err, obj2) {
                                if (err) {
                                    return next(err);
                                }
                                else if (obj2){
                                    console.log("updating, updated");
                                    logger.log(username, 'update', obj, model);
                                    if (model == Storage) {
                                        postProcessor.process(model, obj, itemId, res, next);
                                    }
                                    res.json(obj2);
                                } else {
                                    res.status(400);
                                    res.send("Object doesn't exist");
                                }
                            });
                        }
                    });
                }
                else {
                     res.status(400);
                     res.send("Object doesn't exist");
                }
            });
        }
        else {
             res.status(400);
             res.send("Object doesn't exist");
        }
    });
};

var deleteWithoutUserAccess = function(req, res, next, model, itemId, username) {
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
                    postProcessor.process(model, item, itemId, res, next);
                    logger.log(username, 'delete', item, model);
                    res.json(item);
                }
            });
        }
    });
};

var deleteWithUserAccess = function(req, res, next, model, userId, itemId, username) {
    model.findOne({userId: userId, _id: itemId}, function(err, item) {
        if (err) {
            return next(err);
        }
        else {
            item.remove(function(err) {
                if (err) {
                    return next(err);
                }
                else {
                    logger.log(username, 'delete', item, model);
                    res.json(item);
                }
            });
        }
    });
};

var deleteAllWithUserAccess = function(req, res, next, model, userId) {
    model.find({userId: userId}, function(err, items) {
        if (err) {
            return next(err);
        }
        else {
            validateOrders(items, res, next, function(wSpace, rSpace, fSpace){
                console.log("Orders validated.");
                res.send(items);
                postProcessor.process(model, items, '', res, next);
                Storage.findOne({temperatureZone: 'warehouse'}, function(err, storage){
                    var capacity = storage.capacity;
                    var newOccupied = storage.currentOccupiedSpace + wSpace;
                    var newEmpty = capacity - newOccupied;
                    storage.update({currentOccupiedSpace: newOccupied, currentEmptySpace: newEmpty}, function(err, obj){

                    });
                });
                Storage.findOne({temperatureZone: 'refrigerator'}, function(err, storage){
                    var capacity = storage.capacity;
                    var newOccupied = storage.currentOccupiedSpace + rSpace;
                    var newEmpty = capacity - newOccupied;
                    storage.update({currentOccupiedSpace: newOccupied, currentEmptySpace: newEmpty}, function(err, obj){

                    });
                });
                Storage.findOne({temperatureZone: 'freezer'}, function(err, storage){
                    var capacity = storage.capacity;
                    var newOccupied = storage.currentOccupiedSpace + fSpace;
                    var newEmpty = capacity - newOccupied;
                    storage.update({currentOccupiedSpace: newOccupied, currentEmptySpace: newEmpty}, function(err, obj){

                    });
                });
            });
//            item.remove(function(err) {
//                if (err) {
//                    return next(err);
//                }
//                else {
//                    logger.log(username, 'delete', item, model);
//                    res.json(item);
//                }
//            });
        }
    });
};

var validateOrders = function(items, res, next, callback) {
    validateOrdersHelper(0, items, res, next, 0, 0, 0, function(wSpace, rSpace, fSpace){
        callback(wSpace, rSpace, fSpace);
    });
};

var validateOrdersHelper = function(i, items, res, next, wSpace, rSpace, fSpace, callback) {
    if (i == items.length) {
        checkSpaces(res, next, wSpace, rSpace, fSpace, function(){
            callback(wSpace, rSpace, fSpace);
        });
    } else {
        var order = items[i];
        var space = order.space;
        Ingredient.findOne({nameUnique: order.ingredientName.toLowerCase()}, function(err, obj){
            if (err) next(err);
            else if (!obj) {
                res.status(400).send('Ingredient '+order.ingredientName+' does not exist.');
                return;
            } else {
                var temperatureZone = obj.temperatureZone;
                if (temperatureZone == 'warehouse') wSpace += space;
                else if (temperatureZone == 'refrigerator') rSpace += space;
                else if (temperatureZone == 'freezer') fSpace += space;
                else {
                    res.status(400).send('Temperature zone '+temperatureZone+' does not exist.');
                    return;
                }
                validateOrdersHelper(i+1, items, res, next, wSpace, rSpace, fSpace, callback);
            }
        });
    }
};

var checkSpaces = function(res, next, wSpace, rSpace, fSpace, callback) {
    Storage.find({}, function(err, objs){
        if (err) next(err);
        else {
            for (var i = 0; i < objs.length; i++) {
                var obj = objs[i];
                console.log(obj.temperatureZone);
                if (obj.temperatureZone == 'warehouse' && wSpace > obj.currentEmptySpace) {
                    res.status(400).send('Capacity left: '+obj.currentEmptySpace+' sqft will be exceeded for '+ obj.temperatureZone +
                    '. The total space that will be occupied by items in your cart for this temperature is '+ wSpace+'.');
                    return;
                }
                if (obj.temperatureZone == 'refrigerator' && rSpace > obj.currentEmptySpace) {
                    res.status(400).send('Capacity left: '+obj.currentEmptySpace+' sqft will be exceeded for '+ obj.temperatureZone +
                    '. The total space that will be occupied by items in your cart for this temperature is '+ rSpace+'.');
                    return;
                }
                if (obj.temperatureZone == 'freezer' && fSpace > obj.currentEmptySpace) {
                    res.status(400).send('Capacity left: '+obj.currentEmptySpace+' sqft will be exceeded for '+ obj.temperatureZone +
                    '. The total space that will be occupied by items in your cart for this temperature is '+ fSpace+'.');
                    return;
                }
            }
            console.log(wSpace+' '+rSpace+' '+fSpace);
            callback(wSpace, rSpace, fSpace);
        }
    });
};
