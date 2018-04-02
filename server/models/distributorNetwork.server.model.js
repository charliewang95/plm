var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DistributorNetworkSchema = new Schema({
	productName: {
	    type: String,
	    required: true
	},
	productNameUnique: { //auto
        type: String,
        required: true
    },
	isSold: {
	    type: Boolean,
	    required: true
	},
	numUnit: {
	    type: Number,
	    required: true
	},
    numSold: {
        type: Number,
        required: true,
        default: 0
    },
    totalRevenue: {
        type: Number,
        required: true,
        default: 0
    },
    totalCost: {
        type: Number,
        required: true,
        default: 0
    },
});

mongoose.model('DistributorNetwork', DistributorNetworkSchema);