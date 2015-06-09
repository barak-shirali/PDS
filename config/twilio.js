var config    = require('./config');
var db = require('./sequelize');
var client = require('twilio')(config.twilio.ACCOUNT_SID, config.twilio.AUTH_KEY);

var twilio = {
	sendMessage: function(params, next) {
		db.User.find({where : { id: params.to}})
			.success ( function(user) {
				if(!user) return next("Failed to load User " + id);
				params.to = user.phone;
				params.from= config.twilio.NUMBER;
				client.sendMessage(params,
					function(err, responseData) {
						next(err, responseData);
					});
			}).error(function(err) {
				next(err);
			});
	}
};

module.exports = twilio;