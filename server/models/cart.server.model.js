var mongoose = require('mongoose'),
    User = require('mongoose').model('User'),
    Ingredient = require('mongoose').model('Ingredient'),
    Formula = require('mongoose').model('Formula'),
	Schema = mongoose.Schema;

var CartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
	formulaId: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'Formula',
        required: true
	},
	formulaName: {
        type: String,
        required: true
    },
	quantity: { // in pounds
	    type: Number,
	    required: true
	}
});

CartSchema.index({ userId: 1, ingredientId: 1}, { unique: true });

mongoose.model('Cart', CartSchema);