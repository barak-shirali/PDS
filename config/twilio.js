var config    = require('./config');
var db = require('./sequelize');
var client = require('twilio')(config.twilio.ACCOUNT_SID, config.twilio.AUTH_KEY);

var twilio = {
	sendMessage: function(params, next) {
		params.from = config.twilio.NUMBER;
		client.sendMessage(params,
			function(err, responseData) {
				next(err, responseData);
			});
	}
};

module.exports = twilio;