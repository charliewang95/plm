var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var IngredientProductSchema = new Schema({
    ingredientNameUnique: {
        type: String,
        required: true,
        unique: true
    },
    productName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    lotNumber: {
        type: String,
        required: true
    }
});

mongoose.model('IngredientProduct', IngredientProductSchema);

