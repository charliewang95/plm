process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config'),
	mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	passport = require('./config/passport');

var db = mongoose(),
	app = express(),
	passport = passport();

var multer = require('multer');

//app.use(function(req, res, next) {
// res.setHeader('Access-Control-Allow-Origin', '*');
// res.setHeader('Access-Control-Allow-Credentials', 'true');
// res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
// res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
// res.setHeader('Cache-Control', 'no-cache');
// next();
//});
var User = require('mongoose').model('User');
var Storage = require('mongoose').model('Storage');
User.findOne({username: 'admin'}, function(err, obj){
    if (!obj) {
        var admin = new User();
        admin.username = 'admin';
        admin.password = 'whatismongoose';
        admin.email = 'admin@realproducers.net';
        admin.isAdmin = true;
        admin.loggedIn = false;
        admin.save(function(err){
            //console.log(admin);
        });
    }
});

Storage.findOne({temperatureZone: 'freezer'}, function(err, obj){
    if (!obj) {
        var storage = new Storage();
        storage.temperatureZone = 'freezer';
        storage.capacity = 20000;
        storage.save(function(err){
            //console.log(admin);
        });
    }
});

Storage.findOne({temperatureZone: 'refrigerator'}, function(err, obj){
    if (!obj) {
        var storage = new Storage();
        storage.temperatureZone = 'refrigerator';
        storage.capacity = 20000;
        storage.save(function(err){
            //console.log(admin);
        });
    }
});

Storage.findOne({temperatureZone: 'warehouse'}, function(err, obj){
    if (!obj) {
        var storage = new Storage();
        storage.temperatureZone = 'warehouse';
        storage.capacity = 20000;
        storage.save(function(err){
            //console.log(admin);
        });
    }
});

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

    //reroute http to https
    // set up plain http server
    var http = require('http');
    http.createServer(function(req, res) {   
        res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
        res.end();
    }).listen(80);


// app.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV + ' Back-end running at https://localhost:' + config.port);