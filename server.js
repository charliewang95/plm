process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config'),
	mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	passport = require('./config/passport');


var db = mongoose(),
	app = express(),
	passport = passport();

var User = require('mongoose').model('User');
User.findOne({username: 'admin'}, function(err, obj){
    if (!obj) {
        var admin = new User();
        admin.username = 'admin';
        admin.password = 'PassworD';
        admin.email = 'random@duke.edu';
        admin.isAdmin = true;
        admin.loggedIn = false;
        admin.save(function(err){
            //console.log(admin);
        });
    }
})
//app.use(function(req, res, next) {
// res.setHeader('Access-Control-Allow-Origin', '*');
// res.setHeader('Access-Control-Allow-Credentials', 'true');
// res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
// res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
// res.setHeader('Cache-Control', 'no-cache');
// next();
//});

 var fs = require('fs'),
    https = require('https');

    https.createServer({
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    }, app).listen(config.port);

//app.use(function (err, req, res, next) {
    //  console.error(err.stack);
    //  res.status(901).send('Admin required');
//})

// app.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV + ' Back-end running at https://localhost:' + config.port);