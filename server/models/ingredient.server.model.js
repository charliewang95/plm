var mongoose = require('mongoose'),
    Vendor = require('mongoose').model('Vendor'),
	Schema = mongoose.Schema;

var VendorPriceSchema = new Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
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
    packageName: {
        type: String,
        enum: ['sack', 'pail', 'drum', 'supersack', 'truckload', 'railcar'],
        lowercase: true,
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
    if (packageName == 'sack' || packageName == 'pail')
        callback(50);
    else if (packageName == 'drum')
        callback(500);
    else if (packageName == 'supersack')
        callback(2000);
    else if (packageName == 'truckload')
        callback(50000);
    else if (packageName == 'railcar')
        callback(280000);
    else
        callback(0);
};

mongoose.model('Ingredient', IngredientSchema);