var mongoose = require('mongoose'),
    Ingredient = require('mongoose').model('Ingredient'),
	Schema = mongoose.Schema;

var IngredientQuantitySchema = new Schema({
    ingredientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});
mongoose.model('IngredientQuantity', IngredientQuantitySchema);

var FormulaSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    ingredients : [IngredientQuantitySchema]
});

mongoose.model('Formula', FormulaSchema);