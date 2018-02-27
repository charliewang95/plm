var mongoose = require('mongoose'),
    Ingredient = require('mongoose').model('Ingredient'),
	Schema = mongoose.Schema;

var IngredientQuantitySchema = new Schema({
//    ingredientId: {
//        type: mongoose.Schema.Types.ObjectId,
//        ref: 'Ingredient',
//        required: true
//    },
    ingredientName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    nativeUnit: {
        type: String,
        required: true
    },

});
mongoose.model('IngredientQuantity', IngredientQuantitySchema);

var FormulaSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    nameUnique: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    unitsProvided: {
        type: Number,
        required: true
    },
    totalProvided: {
        type: Number,
        required: true,
        default: 0
    },
    totalCost: {
        type: Number,
        required: true,
        default: 0
    },
    ingredients : [IngredientQuantitySchema]
});

//FormulaSchema.pre('save',
//	function(next) {
//	    if (this.totalCost)
//	        this.totalCost = this.totalCost - this.totalCost % 0.01;
//	    next();
//	}
//);
//
//FormulaSchema.pre('update',
//	function(next) {
//	    if (this._update.totalCost)
//	        this._update.totalCost = this._update.totalCost - this._update.totalCost % 0.01;
//	    next();
//	}
//);


mongoose.model('Formula', FormulaSchema);