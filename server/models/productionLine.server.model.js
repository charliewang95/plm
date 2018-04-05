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
    }
});
mongoose.model('IngredientLotUsedInProduct2', IngredientLotUsedInProductSchema2);

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
    startDates: [{
        type: Date
    }],
    endDates: [{
        type: Date
    }],
    quantity: Number,
    newSpentMoney: Number,
    totalSpace: Number,
    arrayInProductOut: [IngredientLotUsedInProductSchema2]

});

ProductionLineSchema.index({ nameUnique: 1, lotNumberUnique: 1, date: 1}, { unique: true });

mongoose.model('ProductionLine', ProductionLineSchema);