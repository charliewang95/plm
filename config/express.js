var config = require('./config'),
	express = require('express'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	flash = require('connect-flash'),
	session = require('express-session');
	// axios = require('axios'),
	//ReactEngine = require('react-engine');

module.exports = function() {
	var app = express();

	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(bodyParser.json());

	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: 'OurSuperSecretCookieSecret'
	}));
//
//    var engine = ReactEngine.server.create();
//    app.engine('.js', engine);

    app.set('views', './server/view');
    app.set('view engine', 'ejs');

	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());

	require('../server/routes/index.server.routes.js')(app);
	require('../server/routes/users.server.routes.js')(app);
	require('../server/routes/vendors.server.routes.js')(app);
	require('../server/routes/ingredients.server.routes.js')(app);
	require('../server/routes/storages.server.routes.js')(app);
	require('../server/routes/orders.server.routes.js')(app);
	require('../server/routes/inventories.server.routes.js')(app);
	require('../server/routes/carts.server.routes.js')(app);


	app.use(express.static('./public'));

	return app;
};