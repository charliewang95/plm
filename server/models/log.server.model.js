var mongoose = require('mongoose'),
    Ingredient = require('mongoose').model('Ingredient'),
	Schema = mongoose.Schema;

var LogSchema = new Schema({
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