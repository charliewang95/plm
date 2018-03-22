var mongoose = require('mongoose'),
    Ingredient = require('mongoose').model('Ingredient'),
    IngredientLot = require('mongoose').model('IngredientLot'),
    IngredientFreshness = require('mongoose').model('IngredientFreshness'),
	Schema = mongoose.Schema;

exports.updateAverageAdd = function(res, next, ingredientName, date, numUnit, callback) {
    Ingredient.findOne({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, ingredient){
        if (err) return next(err);
        else if (!ingredient) return res.status(400).send('Ingredient '+ingredientName+' does not exist.');
        else {
            var oldNumUnit = ingredient.numUnit;
            IngredientFreshness.findOne({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, fresh){

                if (err) return next(err);
                else if (fresh) {
                    var averageMilli = fresh.averageMilli;
                    var newAverageMilli = (averageMilli * oldNumUnit + date.getTime() * numUnit) / (oldNumUnit + numUnit);
                    fresh.update({averageMilli: newAverageMilli});
                    callback();
                }
                else {
                    var newFresh = new IngredientFreshness();
                    newFresh.ingredientName = ingredientName;
                    newFresh.ingredientNameUnique = ingredientNameUnique;
                    newFresh.averageMilli = date.getTime();
                    newFresh.oldestMilli = date.getTime();
                    callback();
                }
            });
        }
    });
};

exports.updateAverageDelete = function(res, next, ingredientName, numUnit, callback) {
    Ingredient.findOne({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, ingredient){
        if (err) return next(err);
        else if (!ingredient) return res.status(400).send('Ingredient '+ingredientName+' does not exist.');
        else {
            var oldNumUnit = ingredient.numUnit;
            IngredientFreshness.findOne({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, fresh){
                if (err) return next(err);
                else if (fresh) {
                    var averageMilli = fresh.averageMilli;
                    var newAverageMilli = (averageMilli * oldNumUnit - date.getTime() * numUnit) / (oldNumUnit - numUnit);
                    fresh.update({averageMilli: newAverageMilli});
                    callback();
                }
                else {
                    return res.status(400).send('Ingredient '+ingredientName+' does not exist.');
                }
            });
        }
    });
};

exports.updateOldestDelete = function(res, next, ingredientName, numUnit, callback) {
    Ingredient.findOne({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, ingredient){
        if (err) return next(err);
        else if (!ingredient) return res.status(400).send('Ingredient '+ingredientName+' does not exist.');
        else {
            var oldNumUnit = ingredient.numUnit;
            IngredientFreshness.findOne({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, fresh){
                if (err) return next(err);
                else if (fresh) {
                    IngredientLot.getOldestLot(res, ingredientName.toLowerCase(), function(lot){
                        fresh.update({oldestMilli: lot.date.getTime()}, function(err, obj){
                            callback();
                        });
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
    IngredientFreshness.findOne({ingredientNameUnique: ingredientName.toLowerCase()}, function(err, fresh){
        if (err) return next(err);
        else if (!fresh) {
            return res.status(400).send('Ingredient '+ingredientName+' does not exist.');
        }
        else {
            var nowDate = new Date();
            var nowTime = nowDate.getTime();
            var oldestDiff = (nowTime - fresh.oldestMilli)/1000/60;
            var oldestMinute = oldestDiff % 60;
            var oldestHour = (oldestDiff/60) % 24;
            var oldestDay = (oldestDiff/60/24);
            var averageDiff = (nowTime - fresh.averageMilli)/1000/60;
            var averageMinute = averageDiff % 60;
            var averageHour = (averageDiff/60) % 24;
            var averageDay = (averageDiff/60/24);

            fresh.update({oldestDay: oldestDay,
                          oldestHour: oldestHour,
                          oldestMinute: oldestMinute,
                          averageDay: averageDay,
                          averageHour: averageHour,
                          averageMinute: averageMinute}, function(err, obj){
                            callback();
                          });
        }
    });
}