var mongoose = require('mongoose'),
    Ingredient = require('mongoose').model('Ingredient'),
	Schema = mongoose.Schema;

var StorageSchema = new Schema({
	ingredientId: {
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
	capacity: { // in pounds
	    type: Number,
	    required: true
	}
});
StorageSchema.index({ ingredientId: 1, temperatureZone: 1}, { unique: true });

mongoose.model('Storage', StorageSchema);