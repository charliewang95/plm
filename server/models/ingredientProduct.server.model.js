var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var IngredientProductSchema = new Schema({
    ingredientNameUnique: {
        type: String,
        required: true
    },
    vendorNameUnique: {
        type: String
    },
    lotNumberUnique: {
        type: String,
        required: true
    },
    lotId: {
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
    },
<<<<<<< HEAD
    // productLotId: {
    //     type: String,
    //     required: true
    // }
=======
    productLotId: {
        type: String,
        required: true
    }
>>>>>>> 84ed8fd6c554c9d5ba2abd12d554a0d0d0af07d4
});

mongoose.model('IngredientProduct', IngredientProductSchema);

