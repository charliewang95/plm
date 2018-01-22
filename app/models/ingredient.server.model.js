var mongoose = require('mongoose'),
//    Vendor = require('mongoose').model('Vendor'),
	Schema = mongoose.Schema;

var IngredientSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    package: {
        type: String,
        enum: ['Sack', 'Pail', 'Drum', 'Supersack', 'Truckload', 'Railcar',
               'sack', 'pail', 'drum', 'supersack', 'truckload', 'railcar'],
        required: true
    },
    temperature: {
        type: Number
    },
    vendors : [{
        type: String
    }]
});

mongoose.model('Ingredient', IngredientSchema);