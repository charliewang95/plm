var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IngredientLotUsedInProductSchema = new Schema({
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
mongoose.model('IngredientLotUsedInProduct', IngredientLotUsedInProductSchema);

var ProductSchema = new Schema({
	name: {
	    type: String,
	    required: true
	},
	nameUnique: {
        type: String,
        required: true
    },
	numUnit: {
	    type: Number,
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
    lotNumberUnique: { //auto
        type: String,
        required: true
    },
    ingredients: [IngredientLotUsedInProductSchema]
});

ProductSchema.index({ nameUnique: 1, lotNumberUnique: 1, date: 1}, { unique: true });

mongoose.model('Product', ProductSchema);