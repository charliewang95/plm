var mongoose = require('mongoose'),
    User = require('mongoose').model('User'),
    Ingredient = require('mongoose').model('Ingredient'),
    Vendor = require('mongoose').model('Vendor'),
	Schema = mongoose.Schema;

var OrderSchema = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
	},
	ingredientId: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'Ingredient',
        required: true
	},
	vendorId: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Vendor',
        required: true
    },
    package: {
        type: Number,
        required: true
    },
    price: {
        type: Number
    }
});

mongoose.model('Order', OrderSchema);
