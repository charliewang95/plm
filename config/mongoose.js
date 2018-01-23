var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function() {
	var db = mongoose.connect(config.db);

	require('../app/models/user.server.model');
	require('../app/models/ingredient.server.model');
	require('../app/models/vendor.server.model');
	require('../app/models/storage.server.model');
	require('../app/models/order.server.model');
	require('../app/models/inventory.server.model');

	return db;
};