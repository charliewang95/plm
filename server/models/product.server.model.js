var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
    }
});

ProductSchema.index({ name: 1, lotNumber: 1, date: 1}, { unique: true });

mongoose.model('Product', ProductSchema);