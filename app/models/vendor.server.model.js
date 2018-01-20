var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

var VendorSchema = new Schema({
	name: {
		type: String,
		trim: true,
		unique: true
	},
	contact: String,
	code: {
	    type: String,
	    unique: true
	}
});

mongoose.model('Vendor', VendorSchema);