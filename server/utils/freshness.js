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
                    var newAverageMilli = Math.floor((averageMilli * oldNumUnit + date.getTime() * numUnit) / (oldNumUnit + numUnit));
                    console.log('new average '+newAverageMilli);
                    fresh.update({averageMilli: newAverageMilli}, function(err, obj){
                        callback();
                    });
                }
                else {
                    var newFresh = new IngredientFreshness();
                    newFresh.ingredientName = ingredientName;
                    newFresh.ingredientNameUnique = ingredientName.toLowerCase();
                    newFresh.averageMilli = date.getTime();
                    newFresh.oldestMilli = date.getTime();
                    newFresh.save(function(err, obj){
                        callback();
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
                    var newAverageMilli = Math.floor((averageMilli * oldNumUnit - date.getTime() * numUnit) / (oldNumUnit - numUnit));
                    fresh.update({averageMilli: newAverageMilli}, function(err, obj){
                        callback();
                    });
                }
                else {
                    return res.status(400).send('Ingredient '+ingredientName+' does not exist.');
                }
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
                    return res.status(400).send('Ingredient '+ingredientName+' does not exist.');
                }
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