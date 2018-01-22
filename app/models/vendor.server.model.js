var mongoose = require('mongoose'),
    Ingredient = require('mongoose').model('Ingredient'),
	Schema = mongoose.Schema;

var VendorSchema = new Schema({
	name: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},
	contact: String,
	code: {
	    type: String,
	    unique: true,
	    required: true
	},
	ingredients: [{
	    type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient'
	}]
});

mongoose.model('Vendor', VendorSchema);