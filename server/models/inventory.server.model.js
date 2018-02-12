var mongoose = require('mongoose'),
    User = require('mongoose').model('User'),
    Ingredient = require('mongoose').model('Ingredient'),
	Schema = mongoose.Schema;

var InventorySchema = new Schema({
	ingredientId: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'Ingredient',
        required: true,
        unique: true
	},
	ingredientName: {
	    type: String,
	    required: true,
	    unique: true
	},
	temperatureZone: {
        type: String,
        enum: ['freezer', 'refrigerator', 'warehouse'],
        required: true
    },
    packageName: {
        type: String,
        enum: ['sack', 'pail', 'drum', 'supersack', 'truckload', 'railcar'],
        lowercase: true,
        required: true
    },
    space: { //in sqft
        type: Number,
        //required: true
    },
    nativeUnit: { //in sqft
        type: String,
        //required: true
    },
    numUnit: {
        type: Number,
        //required: true
    }
});

//InventorySchema.index({ ingredientId: 1, packageName: 1}, { unique: true });

mongoose.model('Inventory', InventorySchema);
