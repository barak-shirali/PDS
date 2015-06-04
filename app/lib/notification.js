var db = require('../../config/sequelize');
var _ = require('lodash');
var async = require('async');


var sendGSM = function(regIds, message, next) {
	console.log('---Sending GSM to ' + regIds.join());
	next();
};

var sendAPN = function(tokens, message, next) {
	console.log('---Sending APN to ' + tokens.join());
	next();
};

exports.sendNotification = function(userId, message, next) {
	db.UserDevice.all({where: {UserId: userId}})
		.success(function(devices) {
			var android = [], ios = [];
			_.each(devices, function(device) {
				if(device.type == 'IOS') {
					ios.push(device.token);
				}
				else if(device.type == 'ANDROID') {
					android.push(device.token);
				}
			});

			sendGSM(android, message, function() {
				sendAPN(ios, message, function() {
					next();
				});
			});
		})
		.error(function(err) {
			console.log(err);
			next();
		});
};