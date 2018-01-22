var mongoose = require('mongoose'),
    Ingredient = require('mongoose').model('Ingredient'),
	Schema = mongoose.Schema;

var StorageSchema = new Schema({
	ingredientName: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
        required: true
	},
	temperatureZone: {
	    type: String,
	    enum: ['freezer', 'refrigerator', 'warehouse',
	           'Freezer', 'Refrigerator', 'Warehouse'],
	    required: true
	},
	capacity: {
	    type: Number,
	    required: true
	}
});

mongoose.model('Storage', StorageSchema);