var mongoose = require('mongoose'),
    Vendor = require('mongoose').model('Vendor'),
	Schema = mongoose.Schema;

var VendorPriceSchema = new Schema({
    codeUnique: {
        type: String,
        required: true
    },
    vendorName: {
        type: String,
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
    }
});
mongoose.model('VendorPrice', VendorPriceSchema);

var IngredientSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
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
    moneySpent: {
        type: Number,
        default: 0
    },
    moneyProd: {
        type: Number,
        default: 0
    },
    nativeUnit: {
        type: String,
        required: true
    },
    numUnitPerPackage: {
        type: Number,
        required: true,
        min: [0, 'Number cannot be negative'],
    },
    vendors : [VendorPriceSchema]
});

//IngredientSchema.index({ name: 1, packageName: 1}, { unique: true });

IngredientSchema.methods.getPackageSpace = function(packageName, callback) {
    if (packageName == 'sack')
        callback(0.5);
    else if (packageName == 'pail')
        callback(1);
    else if (packageName == 'drum')
        callback(3);
    else if (packageName == 'supersack')
        callback(16);
    else if (packageName == 'truckload')
        callback(0);
    else if (packageName == 'railcar')
        callback(0);
    else
        callback(-1);
};

mongoose.model('Ingredient', IngredientSchema);