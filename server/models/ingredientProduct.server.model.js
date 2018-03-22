var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var IngredientProductSchema = new Schema({
    ingredientNameUnique: {
        type: String,
        required: true
    },
    vendorNameUnique: {
        type: String,
        required: true
    },
    lotNumberUnique: {
        type: String,
        required: true
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

