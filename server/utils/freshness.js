var mongoose = require('mongoose'),
    Ingredient = require('mongoose').model('Ingredient'),
    IngredientLot = require('mongoose').model('IngredientLot'),
    IngredientFreshness = require('mongoose').model('IngredientFreshness'),
	Schema = mongoose.Schema;

exports.updateAverageAdd = function(res, next, ingredientName, date, numUnit, callback) {
    Ingredient.findOne({nameUnique: ingredientName.toLowerCase()}, function(err, ingredient){
        if (err) return next(err);
        else if (!ingredient) return res.status(400).send('Ingredient '+ingredientName+' does not exist. 007');
        else {
            var oldNumUnit = ingredient.numUnit;
            IngredientFreshness.findOne({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, fresh){

                if (err) return next(err);
                else if (fresh) {
                    console.log('freshness already exists');
                    var averageMilli = fresh.averageMilli;
                    console.log('average '+averageMilli);
                    var newAverageMilli = Math.floor((Number(averageMilli)*Number(oldNumUnit) + date.getTime()*Number(numUnit)) / (Number(oldNumUnit) + Number(numUnit)));
                    console.log('now date '+date.getTime());
                    console.log('old num '+oldNumUnit+'numUnit '+numUnit);
                    console.log('new average '+newAverageMilli);
                    addTotal(res, next, numUnit, date, function(){
                        fresh.update({averageMilli: newAverageMilli}, function(err, obj){
                            callback();
                        });
                    });
                }
                else {
                    var newFresh = new IngredientFreshness();
                    newFresh.ingredientName = ingredientName;
                    newFresh.ingredientNameUnique = ingredientName.toLowerCase();
                    newFresh.averageMilli = date.getTime();
                    newFresh.oldestMilli = date.getTime();
                    addTotal(res, next, numUnit, date, function(){
                        newFresh.save(function(err, obj){
                           callback();
                        });
                    });
                }
            });
        }
    });
};

exports.updateAverageDelete = function(res, next, date, ingredientName, numUnit, callback) {
    Ingredient.findOne({nameUnique: ingredientName.toLowerCase()}, function(err, ingredient){
        if (err) return next(err);
        else if (!ingredient) return res.status(400).send('Ingredient '+ingredientName+' does not exist. 006');
        else {
            var oldNumUnit = ingredient.numUnit;
            IngredientFreshness.findOne({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, fresh){
                if (err) return next(err);
                else if (fresh) {
                    var averageMilli = fresh.averageMilli;
                    IngredientLot.getOldestLot(res, ingredientName.toLowerCase(), function(lot){
                        if (lot && oldNumUnit != numUnit) {
                            var newAverageMilli = Math.floor((averageMilli * oldNumUnit - lot.date.getTime() * numUnit) / (oldNumUnit - numUnit));
                            console.log("OLD AVERAGE "+averageMilli+"NEW AVERAGE "+newAverageMilli);
                            fresh.update({averageMilli: newAverageMilli}, function(err, obj){
                                deleteTotal(res, next, numUnit, date, lot.date, function(){
                                    callback();
                                })
                            });
                        }
                        else {
                            fresh.remove(function(err){
                                deleteTotal(res, next, numUnit, date, lot.date, function(){
                                    callback();
                                })
                            });
                        }
                    });
                } else {
                    callback();
                }
//                else {
//                    return res.status(400).send('Ingredient '+ingredientName+' does not exist.');
//                }
            });
        }
    });
};

exports.updateOldestDelete = function(res, next, date, ingredientName, numUnit, callback) {
    Ingredient.findOne({nameUnique: ingredientName.toLowerCase()}, function(err, ingredient){
        if (err) return next(err);
        else if (!ingredient) return res.status(400).send('Ingredient '+ingredientName+' does not exist. 005');
        else {
            var oldNumUnit = ingredient.numUnit;
            IngredientFreshness.findOne({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, fresh){
                if (err) return next(err);
                else if (fresh) {
                    IngredientLot.getOldestLot(res, ingredientName.toLowerCase(), function(lot){
                        if (lot) {
                            fresh.update({oldestMilli: lot.date.getTime()}, function(err, obj){
                                callback();
                            });
                        } else {
                            fresh.remove(function(err){
                                callback();
                            });
                        }
                    });
                }
                else {
                    callback();
                }
//                else {
//                    return res.status(400).send('Ingredient '+ingredientName+' does not exist.');
//                }
            });
        }
    });
};

exports.getLatestInfo = function(res, next, ingredientName, callback) {
    if (!ingredientName) return res.json([]);
    IngredientFreshness.findOne({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, fresh){
        if (err) return next(err);
        else if (fresh){
            console.log('updating freshness data');
            var nowDate = new Date();
            var nowTime = nowDate.getTime();
            var oldestDiff = Math.floor((nowTime - fresh.oldestMilli)/1000/60);
            console.log('oldestDiff '+oldestDiff);
            var oldestMinute = Math.floor(oldestDiff % 60);
            var oldestHour = Math.floor((oldestDiff/60) % 24);
            var oldestDay = Math.floor(oldestDiff/60/24);
            var averageDiff = Math.floor((nowTime - fresh.averageMilli)/1000/60);
            console.log('averageDiff '+averageDiff);
            var averageMinute = Math.floor(averageDiff % 60);
            var averageHour = Math.floor((averageDiff/60) % 24);
            var averageDay = Math.floor(averageDiff/60/24);

            fresh.update({oldestDay: oldestDay,
                          oldestHour: oldestHour,
                          oldestMinute: oldestMinute,
                          averageDay: averageDay,
                          averageHour: averageHour,
                          averageMinute: averageMinute}, function(err, obj){
                            console.log('updated freshness data');
                            //console.log(fresh);
                            callback();
                          });
        }
        else {
            callback();
        }
    });
}

var addTotal = function(res, next, numUnit, date, callback){
    IngredientFreshness.findOne({ingredientNameUnique: 'total'}, function(err, obj){
        if (obj) {
            var totalAverage = obj.averageMilli;
            var totalOldest = obj.oldestMilli;
            var totalNumUnit = obj.numUnit;
            var newTotalAverage = Math.floor((Number(totalAverage)*Number(totalNumUnit) + date.getTime()*Number(numUnit)) / (Number(totalNumUnit) + Number(numUnit)));
            obj.update({averageMilli: newTotalAverage}, function(err, obj){
                callback();
            });
        } else {
            var newFresh = new IngredientFreshness();
            newFresh.ingredientName = 'total';
            newFresh.ingredientNameUnique = 'total';
            newFresh.averageMilli = date.getTime();
            newFresh.oldestMilli = date.getTime();
            newFresh.numUnit = numUnit;
            newFresh.save(function(err, obj){
                callback();
            });
        }
    });
}

var deleteTotal = function(res, next, numUnit, date, oldDate, callback) {
    IngredientFreshness.findOne({ingredientNameUnique: '__total__'}, function(err, obj){
    if (obj) {
        var totalAverage = obj.averageMilli;
        var totalOldest = obj.oldestMilli;
        var totalNumUnit = obj.numUnit;
        var newTotalAverage = Math.floor((Number(totalAverage)*Number(totalNumUnit) - oldDate.getTime()*Number(numUnit)) / (Number(totalNumUnit) + Number(numUnit)));
        obj.update({averageMilli: newTotalAverage}, function(err, obj){
            if (oldDate.getTime() == totalOldest) {
                fresh.update({oldestMilli: oldDate.getTime()}, function(err, obj){
                    callback();
                });
            } else {
                callback();
            }
        });
    } else {

    callback();
    }
    });
}