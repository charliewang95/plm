var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Ingredient = mongoose.model('Ingredient');
var IngredientPrice = mongoose.model('IngredientPrice');
var Vendor = mongoose.model('Vendor');
var VendorPrice = mongoose.model('VendorPrice');
var Storage = mongoose.model('Storage');
var Formula = mongoose.model('Formula');
var Product = mongoose.model('Product');
var IngredientLot = mongoose.model('IngredientLot');
var IngredientProduct = mongoose.model('IngredientProduct');
var validator = require('./validator');
var postProcessor = require('./postProcessorCreateUpdate');
var validatorDelete = require('./validatorDelete');
var deleteProcessor = require('./postProcessorDelete');
var checkoutProcessor = require('./checkoutProcessor');
var logger = require('./logger');

/*************

CHECKOUT ORDER PROCESSOR

*************/

exports.checkoutOrders = function(req, res, next, model, userId, username) {
    model.find({userId: userId}, function(err, items) {
        if (err) {
            return next(err);
        }
        else {
            validateOrders(items, res, next, function(wSpace, rSpace, fSpace){
                console.log("Orders validated.");
                addIngredientLots(req, res, next, items, 0, function(){
                    deleteProcessor.process(model, items, '', res, next);
                    updateStorage(wSpace, rSpace, fSpace);
                    logger.log(username, 'checkout', items[0], model);
                    res.send(items);
                });
            });
        }
    });
};

var addIngredientLots = function(req, res, next, items, i, callback){
    if (i == items.length) {
        callback();
    } else {
        var order = items[i];
        var assignments = order.ingredientLots;
        for (var j = 0; j<assignments.length; j++) {
            var assignment = assignments[i];
            var lotNumber = assignment.lotNumber;
            var lotNumberUnique = assignment.lotNumber.toLowerCase();
            var numPackage = assignment.package();
//            IngredientLot.findOne({ingredientNameUnique: order.ingredientName.toLowerCase(),
//                                   vendorNameUnique: order.vendorName.toLowerCase(),
//                                   lotNumberUnique: lotNumberUnique}, function(err, ingredientLot){
//                 if (err) return next(err);
//                 else if (!ingredientLot) {
                    Ingredient.findOne({nameUnique: order.ingredientName.toLowerCase()}, function(err, ingredient){
                        if (err) return next(err);
                        else if (!ingredient) return res.status(400).send('Ingredient '+order.ingredientName+' does not exist.');
                        else {
                            var newIngredientLot = new IngredientLot();
                            newIngredientLot.ingredientName = order.ingredientName;
                            newIngredientLot.ingredientNameUnique = order.ingredientName.toLowerCase();
                            newIngredientLot.ingredientId = order.ingredientId;
                            newIngredientLot.numUnit = numPackage * ingredient.numUnitPerPackage;
                            newIngredientLot.date = new Date();
                            newIngredientLot.lotNumber = lotNumber;
                            newIngredientLot.lotNumberUnique = lotNumberUnique;
                            newIngredientLot.vendorName = order.vendorName;
                            newIngredientLot.vendorNameUnique = order.vendorName.toLowerCase();
                            newIngredientLot.save(function(err){

                            });
                        }
                    });
//                 }
//            });
        }
    }
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
                console.log('***********'+space);
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
                    '. The total space that will be occupied by items in your cart for warehouse is '+ wSpace+'.');
                    return;
                }
                if (obj.temperatureZone == 'refrigerator' && rSpace > obj.currentEmptySpace) {
                    res.status(400).send('Capacity left: '+obj.currentEmptySpace+' sqft will be exceeded for '+ obj.temperatureZone +
                    '. The total space that will be occupied by items in your cart for refrigerator is '+ rSpace+'.');
                    return;
                }
                if (obj.temperatureZone == 'freezer' && fSpace > obj.currentEmptySpace) {
                    res.status(400).send('Capacity left: '+obj.currentEmptySpace+' sqft will be exceeded for '+ obj.temperatureZone +
                    '. The total space that will be occupied by items in your cart for freezer is '+ fSpace+'.');
                    return;
                }
            }
            console.log(wSpace+' '+rSpace+' '+fSpace);
            callback();
        }
    });
};


/*************

CHECKOUT FORMULA PROCESSOR

*************/

exports.checkoutFormula = function(req, res, next, model, username) {
    var formulaId = req.params.formulaId;
    var quantity = req.params.quantity;
    Formula.findById(formulaId, function(err, formula){
        if (err) return next(err);
        else if (!formula){
            return res.status(400).send('Formula does not exist');
        } else {
            checkProductAmount(req, res, next, formula, quantity, function(){
                checkNewStorageHelper(req, res, next, formula, quantity, function(totalSpace){
                    var multiplier = quantity/formula.unitsProvided;
                    var ingredients = formula.ingredients;
                    checkIngredientHelper(req, res, next, multiplier, 0, ingredients, [], true, function(array, viable){
                          if (req.params.action == 'review') {
                              res.json(array);
                          } else {
                              if (viable) { //check complete
                                  var date = new Date();
                                  updateIngredientHelper(req, res, next, multiplier, ingredients, formula, 0, 0, [], date, function(newSpentMoney, arrayInProductOut) {
                                      var totalProvided = formula.totalProvided;
                                      var totalCost = formula.totalCost;
                                      formula.update({totalProvided: Number(totalProvided)+Number(quantity), totalCost:totalCost+newSpentMoney}, function(err, obj) {
                                          if (err) return next(err);
                                          else {
                                            updateStorageAfterCheckoutIP(res, req, next, formula, totalSpace);
                                            console.log(formula.isIntermediate);
                                            if (!formula.isIntermediate) {
                                                //TODO: add ingredientLotUsedInProduct in the product object
                                                addProduct(req, res, next, formula, quantity, arrayInProductOut, date, function() {
                                                    logger.log(username, 'checkout', formula, model);
                                                    return res.send(formula);
                                                });
                                            } else {
                                                //TODO: add ingredient and ingerdientLot object if intermediate
                                                addIntermediateProductIngredientLot(req, res, next, formula, quantity, totalSpace, date, function(){
                                                    logger.log(username, 'checkout', formula, model);
                                                    return res.send(formula);
                                                });
                                            }
                                          }
                                      });
                                  });
                              } else {
                                  return res.status(406).json(array);
                              }
                          }
                    });
                });
            });
        }
    });
};

var checkProductAmount = function(req, res, next, formula, quantity, callback) {
    var unitsProvided = formula.unitsProvided;
    if (quantity < unitsProvided) {
        return res.status(400).send('The amount provided must be at least '+unitsProvided+'.');
    } else {
        callback();
    }
};

var checkNewStorageHelper = function(req, res, next, formula, quantity, callback) {
    if (formula.isIntermediate){
        Storage.findOne({temperatureZone: formula.temperatureZone}, function(err, storage){
            var currentEmpty = storage.currentEmptySpace;
            Ingredient.getPackageSpace(formula.packageName, function(space){
                var totalSpace = Math.ceil(quantity/formula.numUnitPerPackage)*space;
                if (totalSpace > currentEmpty) {
                    res.status(400).send('Storage left for '+formula.temperatureZone+' will be exceeded by the produced product\'s total space: '+totalSpace);
                } else {
                    if (formula.packageName == null || formula.temperatureZone == null || formula.nativeUnit == null || formula.nativeUnit == '' || formula.numUnitPerPackage == null){
                        return res.status(400).send('Not all information (package name/temperature zone/native unit/native units per package) is given for this intermediate product.');
                    } else {
                        callback(totalSpace);
                    }
                }
            });
        });
    } else {
        callback(0);
    }
};

var updateStorageAfterCheckoutIP = function(req, res, next, formula, totalSpace){
    if (formula.isIntermediate) {
        Storage.findOne({temperatureZone: formula.temperatureZone}, function(err, storage){
            var capacity = storage.capacity;
            var newOccupied = storage.currentOccupiedSpace + totalSpace;
            var newEmpty = capacity - newOccupied;
            storage.update({currentOccupiedSpace: newOccupied, currentEmptySpace: newEmpty}, function(err, obj){

            });
        });
    }
}

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
                ingredientDelta.numUnitPerPackage = ingredient.numUnitPerPackage;
                ingredientDelta.vendors = ingredient.vendors;
                ingredientDelta.delta = (totalAmountNeeded - ingredient.numUnit) > 0 ? totalAmountNeeded - ingredient.numUnit : 0;
                missingIngredientArray.push(ingredientDelta);
                console.log(totalAmountNeeded+' '+ingredient.numUnit);
                checkIngredientHelper(req, res, next, multiplier, i+1, ingredients, missingIngredientArray, viable, callback);
            }
        });
    }
}

var updateIngredientHelper = function(req, res, next, multiplier, ingredients, formula, newSpentMoney, i, arrayInProduct, date, callback) {
    if (i == ingredients.length) {
        callback(newSpentMoney, arrayInProduct);
    } else {
        var ingredientQuantity = ingredients[i];
        lotPickerHelper(req, res, next, ingredientQuantity.ingredientName, ingredientQuantity.quantity*multiplier, arrayInProduct, function(arrayInProductOut){

            updateIngredientProduct(req, res, next, ingredients, formula, date, 0);

            Ingredient.findOne({nameUnique: ingredientQuantity.ingredientName.toLowerCase()}, function(err, ingredient){
                var numUnit = ingredient.numUnit;
                var newNumUnit = numUnit - ingredientQuantity.quantity*multiplier;
                var remainingPackages = Math.ceil(1.0*newNumUnit/ingredient.numUnitPerPackage);

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
                                var subSpace = retSpace*Math.ceil(1.0*ingredientQuantity.quantity*multiplier/ingredient.numUnitPerPackage);
                                storage.update({currentOccupiedSpace: capacityOccupied-subSpace, currentEmptySpace: capacity-capacityOccupied+subSpace}, function(err, obj){
                                    if (err) return next(err);
                                    else {
                                        console.log(subSpace+' '+retSpace+' '+ingredientQuantity.quantity*multiplier/ingredient.numUnitPerPackage);
                                        updateIngredientHelper(req, res, next, multiplier, ingredients, formula, newSpentMoney, i+1, arrayInProductOut, date, callback);
                                    }
                                });
                            });
                        }
                    });
                });
            });
        });
    }
};

var lotPickerHelper = function(req, res, next, ingredientName, quantity, arrayInProduct, callback) {
    IngredientLot.getOldestLot(res, ingredientName.toLowerCase(), function(lot){
        var ingredientLotUsedInProduct = new Object();
        ingredientLotUsedInProduct.ingredientName = ingredientName;
        ingredientLotUsedInProduct.vendorName = lot.vendorName;
        ingredientLotUsedInProduct.lotNumber = lot.lotNumber;
        arrayInProduct.push(ingredientLotUsedInProduct);
        if (quantity < lot.numUnit) {
            var newNumUnit = lot.numUnit - quantity;
            lot.update({numUnit: newNumUnit}, function(err, obj){
                callback(arrayInProduct);
            });
        } else if (quantity == lot.numUnit) {
            lot.remove(function(err){
                callback(arrayInProduct);
            });
        } else {
            lot.remove(function(err){
                lotPickerHelper(req, res, next, ingredientName, quantity - lot.numUnit, arrayInProduct, callback);
            });
        }
    });
};

var addProduct = function(req, res, next, formula, numUnit, arrayInProductOut, callback){
    var product = new Product();
    product.name = formula.name;
    product.nameUnique = formula.name.toLowerCase();
    product.numUnit = numUnit;
    product.date = date;
    product.lotNumber = 'PR'+date.getTime();
    product.ingredients = arrayInProductOut;
    product.lotNumberUnique = product.lotNumber.toLowerCase();
    product.save(function(err){
        if (err) return next(err);
        else callback();
    })
};

var addIntermediateProductIngredientLot = function(req, res, next, formula, numUnit, totalSpace, callback){
    Ingredient.findOne({nameUnique: formula.nameUnique}, function(err, ingredient){
        if (err) return next(err);
        else if (!ingredient){
            var newIngredient = new Ingredient();
            //TODO: update moneyspent and moneyprod, if needed
            newIngredient.name = formula.name;
            newIngredient.nameUnique = formula.nameUnique;
            newIngredient.packageName = formula.packageName;
            newIngredient.temperatureZone = formula.temperatureZone;
            newIngredient.nativeUnit = formula.nativeUnit;
            newIngredient.numUnitPerPackage = formula.numUnitPerPackage;
            newIngredient.numUnit = numUnit;
            newIngredient.space = totalSpace;
            newIngredient.isIntermediate = true;

            newIngredient.save(function(err){
                if (err) return next(err);
                else {
                    Ingredient.findOne({nameUnique: newIngredient.nameUnique}, function(err, obj){
                        var ingredientLot = new IngredientLot();
                        ingredientLot.ingredientName = newIngredient.name;
                        ingredientLot.ingredientNameUnique = newIngredient.nameUnique;
                        ingredientLot.ingredientId = obj._id;
                        ingredientLot.numUnit = numUnit;
                        ingredientLot.date = date;
                        ingredientLot.lotNumber = 'IP'+date.getTime();
                        ingredientLot.lotNumberUnique = ingredientLot.lotNumber.toLowerCase();
                        //ingredientLot.vendorName = '(Intermediate Product)';
                        ingredientLot.save(function(err){
                            if (err) return next(err);
                            else {
                                updateIngredientProduct(req, res, next, formula.ingredients, 0);
                            }
                        });
                    });
                }
            });
        } else {
            var newNumUnit = ingredient.numUnit + numUnit;
            var newSpace = ingredient.space + totalSpace;
//            products = ingredient.products;
//            var productInIngredient = new Object();
//            productInIngredient.productName = formula.name;
//            productInIngredient.date = date;
//            productInIngredient.lotNumber = 'IP'+date.getTime();
//            productInIngredient.vendorName = 'N/A';
//            products.push(productInIngredient);
            ingredient.update({numUnit: newNumUnit, space: newSpace}, function(err, obj){
                var ingredientLot = new IngredientLot();
                ingredientLot.ingredientName = ingredient.name;
                ingredientLot.ingredientNameUnique = ingredient.nameUnique;
                ingredientLot.ingredientId = ingredient._id;
                ingredientLot.numUnit = newNumUnit;
                ingredientLot.date = date;
                ingredientLot.lotNumber = 'IP'+date.getTime();
                ingredientLot.lotNumberUnique = ingredientLot.lotNumber.toLowerCase();
                ingredientLot.save(function(err){
                    if (err) return next(err);
                });
            });
        }
    });
};

var updateIngredientProduct = function(req, res, next, ingredients, formula, date, i) {
    if (i == ingredients.length) {
        return;
    }
    else {
        var ingredientName = ingredients[i];
        var newIngredientProduct = new IngredientProduct();
        newIngredientProduct.ingredientNameUnique = ingredientName.toLowerCase();
        newIngredientProduct.productName = formula.name;
        newIngredientProduct.date = date;
        newIngredientProduct.lotNumber = (formula.isIntermediate) ? 'IP'+date.getTime() : 'PR'+date.getTime();
        newIngredientProduct.save(function(err){
            updateIngredientProduct(req, res, next, ingredients, formula, date, i+1);
        });
    }

};