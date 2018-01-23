var mongoose = require('mongoose'),
    User = require('mongoose').model('User'),
    Ingredient = require('mongoose').model('Ingredient'),
	Schema = mongoose.Schema;

var InventorySchema = new Schema({
	userName: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
	},
	ingredientName: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'Ingredient',
        required: true
	},
    quantity: { //in pounds
        type: Number,
        required: true
    }
});

mongoose.model('Inventory', InventorySchema);
