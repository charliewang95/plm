var mongoose = require('mongoose'),
    User = require('mongoose').model('User'),
    Ingredient = require('mongoose').model('Ingredient'),
	Schema = mongoose.Schema;

var CartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
	ingredientId: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
        required: true
	},
	quantity: { // in pounds
	    type: Number,
	    required: true
	}
});

CartSchema.index({ userId: 1, ingredientId: 1}, { unique: true });

mongoose.model('Cart', CartSchema);