//uploads.server.routes.js
//This file handles routing for uploading the bulk-import file

var express = require('express');
var router = express.Router();
var util = require("util");
var fs = require("fs"); 

module.exports = function(app) {
	app.route('/upload/user/:userId').post(function(req, res, next){
		if (req.files) {
			console.log(util.inspect(req.files));
			const filePath = './'.concat(req.files[0].path);
			console.log(filePath);
			const content = fs.readFileSync(filePath, 'utf8');
			// console.log(content);
			fs.unlinkSync(filePath);//delete the file
			res.send("SUCCESS");

			// if (req.files.myFile.size === 0) {
			// 	return next(new Error("Hey, first would you select a file?"));
			// }
			// fs.exists(req.files.myFile.path, function(exists) {
			// 	if(exists) {
			// 		res.end("Got your file!");
			// 	} else {
			// 		res.end("Well, there is no magic for those who don’t believe in it!");
			// 	}
			// });
		}
	});
};
