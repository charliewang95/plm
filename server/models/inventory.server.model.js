var mongoose = require('mongoose'),
    User = require('mongoose').model('User'),
    Ingredient = require('mongoose').model('Ingredient'),
	Schema = mongoose.Schema;

var InventorySchema = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
	},
	ingredientId: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'Ingredient',
        required: true,
        unique: true
	},
	ingredientName: {
	    type: String,
	    required: true
	},
	temperatureZone: {
        type: String,
        enum: ['freezer', 'refrigerator', 'warehouse'],
        required: true
    },
    quantity: { //in pounds
        type: Number,
        required: true
    }
});

mongoose.model('Inventory', InventorySchema);
