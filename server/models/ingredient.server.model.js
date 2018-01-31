var mongoose = require('mongoose'),
//    Vendor = require('mongoose').model('Vendor'),
	Schema = mongoose.Schema;

var VendorPriceSchema = new Schema({
    vendor: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});
mongoose.model('VendorPrice', VendorPriceSchema);

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
        enum: ['freezer', 'refrigerator', 'warehouse'],
        required: true
    },
    vendors : [VendorPriceSchema]
});

IngredientSchema.methods.getPackagePounds = function(packageName, callback) {
    if (packageName == 'Sack' || packageName == 'sack' || packageName == 'Pail' || packageName == 'pail')
        callback(50);
    else if (packageName == 'Drum' || packageName == 'drum')
        callback(500);
    else if (packageName == 'Supersack' || packageName == 'supersack')
        callback(2000);
    else if (packageName == 'Truckload' || packageName == 'truckload')
        callback(50000);
    else if (packageName == 'Railcar' || packageName == 'railcar')
        callback(280000);
    else
        callback(0);
};

mongoose.model('Ingredient', IngredientSchema);