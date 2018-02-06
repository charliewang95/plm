var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function() {
	var db = mongoose.connect(config.db);

	require('../server/models/user.server.model');
	require('../server/models/vendor.server.model');
	require('../server/models/ingredient.server.model');
	require('../server/models/storage.server.model');
	require('../server/models/order.server.model');
	require('../server/models/inventory.server.model');
	require('../server/models/cart.server.model');

	return db;
};