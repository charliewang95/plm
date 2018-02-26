var mongoose = require('mongoose');
var User = mongoose.model('User');
var Log = mongoose.model('Log');
var Storage = mongoose.model('Storage');
var Formula = mongoose.model('Formula');
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
            else if (action == 'checkoutOrders') checkoutOrders(req, res, next, model, userId, user.username);
            else if (action == 'checkoutFormula') checkoutFormula(req, res, next, model, user.username);
            else if (action == 'read') read(req, res, next, model, itemId, user.username);
            else if (action == 'readWithUserAccess') readWithUserAccess(req, res, next, model, userId, itemId, user.username);
            else {
                res.status(400);
                res.send('Something went wrong');
            }
        }
    });
};

exports.bypassAndDo = function(req, res, next, model, action, itemId) {
    console.log('bypassed check');
    console.log(req.body);
    if (action == 'create') create(req, res, next, model);
    // else if (action == 'list') list(req, res, next, model);
    // else if (action == 'listPartial') listPartial(req, res, next, model, userId);
    // else if (action == 'update') update(req, res, next, model, itemId);
    // else if (action == 'updateWithUserAccess') update(req, res, next, model, userId, itemId);
    // else if (action == 'delete') deleteWithoutUserAccess(req, res, next, model, itemId);
    // else if (action == 'deleteWithUserAccess') deleteWithUserAccess(req, res, next, model, userId, itemId);
    // else if (action == 'deleteAllWithUserAccess') deleteAllWithUserAccess(req, res, next, model, userId);
    // else if (action == 'read') read(req, res, next, model, itemId);
    // else if (action == 'readWithUserAccess') readWithUserAccess(req, res, next, model, userId, itemId);
    else {
        res.status(400);
        res.send('Something went wrong');
    }
    return;
};



var list = function(req, res, next, model, username) {
	model.find({}, function(err, items) {
		if (err) {
			return next(err);
		}
		else {
		    console.log(items);
			res.json(items);
		}
	});
};

var listPartial = function(req, res, next, model, itemId, username) {
	model.find({userId: itemId}, function(err, items) {

		console.log(itemId);
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
                            logger.log(username, 'update', obj2, model);
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
    console.log(req.body);
    console.log(userId);
    console.log(itemId);
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
                                    logger.log(username, 'update', obj2, model);
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

var checkoutOrders = function(req, res, next, model, userId, username) {
    model.find({userId: userId}, function(err, items) {
        if (err) {
            return next(err);
        }
        else {
            validateOrders(items, res, next, function(wSpace, rSpace, fSpace){
                console.log("Orders validated.");
                res.send(items);
                postProcessor.process(model, items, '', res, next);
                logger.log(username, 'checkout', items[0], model);
                updateStorage(wSpace, rSpace, fSpace);
            });
        }
    });
};

var updateStorage = function(wSpace, rSpace, fSpace) {
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
        if (order.vendorName == null || order.vendorName == '') {
            res.status(400).send('Vendor has not been chosen for ingredient '+order.ingredientName+'.');
            return;
        }
        var space = order.space;
        Ingredient.findOne({nameUnique: order.ingredientName.toLowerCase()}, function(err, obj){
            if (err) return next(err);
            else if (!obj) {
                res.status(400).send('Ingredient '+order.ingredientName+' does not exist.');
                return;
            } else {
                var temperatureZone = obj.temperatureZone;
                if (temperatureZone == 'warehouse' && obj.packageName != 'railcar' && obj.packageName != 'truckload') wSpace += space;
                else if (temperatureZone == 'refrigerator' && obj.packageName != 'railcar' && obj.packageName != 'truckload') rSpace += space;
                else if (temperatureZone == 'freezer' && obj.packageName != 'railcar' && obj.packageName != 'truckload') fSpace += space;
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
        if (err) return next(err);
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
            callback();
        }
    });
};

var checkoutFormula = function(req, res, next, model, username) {
    var formulaId = req.params.formulaId;
    var quantity = req.params.quantity;
    Formula.findById(formulaId, function(err, formula){
        if (err) return next(err);
        else if (!formula){
            return res.status(400).send('Formula does not exist');
        } else {
            var unitsProvided = formula.unitsProvided;
            if (quantity < unitsProvided) {
                return res.status(400).send('The amount provided must be at least '+unitsProvided+'.');
            } else {
                var multiplier = quantity/unitsProvided;
                var ingredients = formula.ingredients;
                checkIngredientHelper(req, res, next, multiplier, 0, ingredients, [], true, function(array, viable){
                      if (req.params.action == 'review') {
                          res.json(array);
                      } else {
                          if (viable) {
                              updateIngredientHelper(req, res, next, multiplier, ingredients, 0, 0, function(newSpentMoney) {
                                  logger.log(username, 'checkout', formula, model);
                                  var totalProvided = formula.totalProvided;
                                  var totalCost = formula.totalCost;
                                  formula.update({totalProvided: totalProvided+1, totalCost:totalCost+newSpentMoney}, function(err, obj) {
                                      if (err) return next(err);
                                      else return res.send(formula);
                                  });
                              });
                          } else {
                              return res.status(406).json(array);
                          }
                      }
                });
            }
        }
    });
};

var checkIngredientHelper = function(req, res, next, multiplier, i, ingredients, missingIngredientArray, viable, callback) {
    if (i == ingredients.length) {
        callback(missingIngredientArray, viable);
    } else {
        var ingredientQuantity = ingredients[i];
        var totalAmountNeeded = multiplier*ingredientQuantity.quantity;
        Ingredient.findOne({nameUnique: ingredientQuantity.ingredientName.toLowerCase()}, function(err, ingredient){
            if (err) return next(err);
            else if (!ingredient) return res.status(400).send('Ingredient '+ingredientQuantity.ingredientName+' does not exist.');
            else {
                if (totalAmountNeeded > ingredient.numUnit) {
                    viable = false;
                }
                var ingredientDelta = new Object();
                ingredientDelta.ingredientId = ingredient._id;
                ingredientDelta.ingredientName = ingredientQuantity.ingredientName;
                ingredientDelta.totalAmountNeeded = totalAmountNeeded;
                ingredientDelta.currentUnit = ingredient.numUnit;
                ingredientDelta.delta = (totalAmountNeeded - ingredient.numUnit) > 0 ? totalAmountNeeded - ingredient.numUnit : 0;
                missingIngredientArray.push(ingredientDelta);
                console.log(totalAmountNeeded+' '+ingredient.numUnit);
                checkIngredientHelper(req, res, next, multiplier, i+1, ingredients, missingIngredientArray, viable, callback);
            }
        });
    }
}

var updateIngredientHelper = function(req, res, next, multiplier, ingredients, newSpentMoney, i, callback) {
    if (i == ingredients.length) {
        callback(newSpentMoney);
    } else {
        var ingredientQuantity = ingredients[i];
        Ingredient.findOne({nameUnique: ingredientQuantity.ingredientName.toLowerCase()}, function(err, ingredient){
            var numUnit = ingredient.numUnit;
            var newNumUnit = numUnit - ingredientQuantity.quantity*multiplier;
            var remainingPackages = Math.ceil(newNumUnit/ingredient.numUnitPerPackage);

            var moneyProd = ingredient.moneyProd;
            var moneySpent = ingredient.moneySpent;
            var newMoneyProd = moneyProd+1.0*ingredientQuantity.quantity*multiplier*(moneySpent-moneyProd)/numUnit;
            newSpentMoney += 1.0*ingredientQuantity.quantity*multiplier*(moneySpent-moneyProd)/numUnit;

            Ingredient.getPackageSpace(ingredient.packageName, function(retSpace){
                var newSpace = remainingPackages * retSpace;
                ingredient.update({numUnit: newNumUnit, space: newSpace, moneyProd: newMoneyProd}, function(err, obj){
                    if (err) return next(err);
                    else {
                        Storage.findOne({temperatureZone: ingredient.temperatureZone}, function(err, storage){
                            var capacity = storage.capacity;
                            var capacityEmpty = storage.currentEmptySpace;
                            var capacityOccupied = storage.currentOccupiedSpace;
                            var subSpace = retSpace*Math.ceil(ingredientQuantity.quantity*multiplier/ingredient.numUnitPerPackage);
                            storage.update({currentOccupiedSpace: capacityOccupied-subSpace, currentEmptySpace: capacity-capacityOccupied+subSpace}, function(err, obj){
                                if (err) return next(err);
                                else {
                                    console.log(subSpace+' '+retSpace+' '+ingredientQuantity.quantity*multiplier/ingredient.numUnitPerPackage);
                                    updateIngredientHelper(req, res, next, multiplier, ingredients, newSpentMoney, i+1, callback);
                                }
                            });
                        });
                    }
                });
            });
        });
    }
};
