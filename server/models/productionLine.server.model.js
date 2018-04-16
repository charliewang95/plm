var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IngredientLotUsedInProductSchema2 = new Schema({
    ingredientName: {
        type: String,
    },
    vendorName: {
        type: String,
    },
    lotNumber: {
        type: String,
    },
    lotId: {
        type: String,
    }
});
mongoose.model('IngredientLotUsedInProduct2', IngredientLotUsedInProductSchema2);

var DateTupleSchema = new Schema({
    startDate: Date,
    endDate: Date
});
mongoose.model('DateTuple', DateTupleSchema);

var ProductionLineSchema = new Schema({
	name: {
	    type: String,
	    required: true
	},
	nameUnique: {
        type: String,
        required: true
    },
	description: {
	    type: String
	},
	formulaNames: [{
	    type: String,
	    required: true
	}],
    isIdle: {
        type: Boolean,
        required: true
    },
    currentFormula: {
        type: String
    },
    dates: [DateTupleSchema],
    quantity: Number,
    newSpentMoney: Number,
    totalSpace: Number,
    arrayInProductOut: [IngredientLotUsedInProductSchema2]

});

ProductionLineSchema.index({ nameUnique: 1, lotNumberUnique: 1, date: 1}, { unique: true });

//ProductionLineSchema.methods.getUtility = function(startDate, endDate, callback) {
//    var startTime = startDate.getTime();
//    var endTime = endDate.getTime();
//    var totalIdle = 0;
//    var totalBusy = 0;
//
//    if (!this.dates || this.dates.length == 0) callback(0);
//
//    for (var i = 0; i < this.dates.length; i++) {
//        var tempDate = this.dates[i];
//        var tempStartTime = tempDate.startDate.getTime();
//        var tempEndTime = tempDate.endDate.getTime();
//        if (tempStartTime < startTime) {
//            if (tempEndTime < endTime)
//        }
//
//
//    }
//}

mongoose.model('ProductionLine', ProductionLineSchema);