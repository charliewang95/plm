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
    temperatureZone: {
        type: String,
        enum: ['freezer', 'refrigerator', 'warehouse',
               'Freezer', 'Refrigerator', 'Warehouse'],
        required: true
    },
    vendors : [{
        type: String
    }]
});

IngredientSchema.methods.getPackagePounds = function(packageName) {
    if (packageName == 'Sack' || packageName == 'sack' || packageName == 'Pail' || packageName == 'pail')
        return 50;
    else if (packageName == 'Drum' || packageName == 'drum')
        return 500;
    else if (packageName == 'Supersack' || packageName == 'supersack')
        return 2000;
    else if (packageName == 'Truckload' || packageName == 'truckload')
        return 50000;
    else if (packageName == 'Railcar' || packageName == 'railcar')
        return 280000;
    else
        return 0;
};

mongoose.model('Ingredient', IngredientSchema);