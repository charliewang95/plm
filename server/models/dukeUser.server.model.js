// dukeUser.server.model.js

var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

var DukeUserSchema = new Schema({
	email: {
	    type: String,
	    required: true
	},
	username: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},
	isAdmin: {
	    type: Boolean,
	    required: true
	},
	isManager: {
	    type: Boolean,
	    //required: true
	},
	loggedIn: {
	    type: Boolean,
        required: true
	}
});

DukeUserSchema.pre('save', 
	function(next) {
	// do nothing
		next();
	}
);

//do not need to authenticate for dukeUsers
/*
DukeUserSchema.methods.authenticate = function(password) {
	var md5 = crypto.createHash('md5');
	md5 = md5.update(password).digest('hex');

	return this.password === md5;
};
*/
DukeUserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var possibleUsername = username + (suffix || '');

	this.findOne(
		{username: possibleUsername},
		function(err, user) {
			if (!err) {
				if (!user) {
					callback(possibleUsername);
				}
				else {
					return this.findUniqueUsername(username, (suffix || 0) + 1, callback);
				}
			}
			else {
				callback(null);
			}
		}
	);
};

mongoose.model('DukeUser', DukeUserSchema);