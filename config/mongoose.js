var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function() {
	// var db = mongoose.connect(config.db); //without authentication
	var db = mongoose.connect(config.dbWithAuth); //with authentication
	require('../server/models/user.server.model');
	require('../server/models/vendor.server.model');
	require('../server/models/ingredient.server.model');
	require('../server/models/storage.server.model');
	require('../server/models/order.server.model');
	require('../server/models/inventory.server.model');
	require('../server/models/formula.server.model');
	require('../server/models/cart.server.model');
	require('../server/models/dukeUser.server.model');
	require('../server/models/log.server.model');

	return db;
};