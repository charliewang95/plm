'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config'),
	mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	passport = require('./config/passport');

var db = mongoose(),
	app = express(),
	passport = passport();

app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
 res.setHeader('Cache-Control', 'no-cache');
 next();
});

 var fs = require('fs'),
    https = require('https'),
    http = require('http');

//for certificate
/*
const PROD = true;
const lex = require('greenlock-express').create({
  server: PROD ? 'https://acme-v01.api.letsencrypt.org/directory' : 'staging',
  challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '/tmp/acme-challenges' }) },
  store: require('le-store-certbot').create({ webrootPath: '/tmp/acme-challenges' }), 
  approveDomains: ['real-producers.colab.duke.edu', 'vcm-3107.vm.duke.edu']/*(opts, certs, cb) => {
    if (certs) {
      // change domain list here
      opts.domains = ['real-producers.colab.duke.edu', 'vcm-3107.vm.duke.edu']
    } else { 
      // change default email to accept agreement
      opts.email = 'ds318@duke.edu'; 
      opts.agreeTos = true;
    }
    cb(null, { options: opts, certs: certs });
  }*//*
});
const middlewareWrapper = lex.middleware;

const redirectHttps = require('redirect-https');
http.createServer(lex.middleware(redirectHttps())).listen(80);

https.createServer(
  lex.httpsOptions, 
  middlewareWrapper(app)
).listen(433);

*/

    http.createServer(function(req, res) {   
        res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
        res.end();
    }).listen(80);

    https.createServer({
      key: fs.readFileSync('/etc/ssl/certs/domain.key'),
      cert: fs.readFileSync('/etc/ssl/private/chained.pem')
    }, app).listen(config.port);

//app.use(function (err, req, res, next) {
    //  console.error(err.stack);
    //  res.status(901).send('Admin required');
//})

// app.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV + ' Back-end running at https://localhost:' + config.port);
