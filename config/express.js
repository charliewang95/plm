var config = require('./config'),
	express = require('express'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	flash = require('connect-flash'),
	session = require('express-session'),
	multer = require('multer'),
	pdf = require('express-pdf'),
	fs = require('fs');

module.exports = function() {
	var app = express();

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(multer({
    	dest: "./uploads/"
	}).any());

	app.get('/format-spec', function(request, response){
  		var tempFile="./public/FormatSpec.pdf";
  		fs.readFile(tempFile, function (err,data){
     	response.contentType("application/pdf");
     	response.send(data);
  	});

	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: 'OurSuperSecretCookieSecret'
	}));
//
//    var engine = ReactEngine.server.create();
//    app.engine('.js', engine);

    app.set('views', './server/views');
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
	require('../server/routes/uploads.server.routes.js')(app);

	app.use(express.static('./public'));
	

})
	return app;
};