var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductionLineSchema = new Schema({
	name: {
	    type: String,
	    required: true
	},
	nameUnique: {
        type: String,
        required: true
    },
	description: {
	    type: String
	},
	formulaNames: [{
	    type: String,
	    required: true
	}],
    isIdle: {
        type: Boolean,
        required: true
    }
});

ProductionLineSchema.index({ nameUnique: 1, lotNumberUnique: 1, date: 1}, { unique: true });

mongoose.model('ProductionLine', ProductionLineSchema);