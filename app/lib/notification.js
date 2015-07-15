var db = require('../../config/sequelize');
var _ = require('lodash');
var async = require('async');
var config    = require('../../config/config');
var gcm = require('node-gcm');
var apn = require('apn');

var sendGSM = function(regIds, data, next) {
	if(regIds.length === 0) {
		next();
		return;
	}
	console.log('---Sending GSM to ' + regIds.join());
	console.log(data);

	var message = new gcm.Message({
	    collapseKey: 'RemitSystem',
	    delayWhileIdle: true,
	    timeToLive: 3,
	    data: data
	});

	var sender = new gcm.Sender(config.google.API_KEY);

	sender.send(message, regIds, function (err, result) {
		if(err) console.error(err);
		else    console.log(result);
	});

	next();
};

var sendAPN = function(tokens, data, next) {
	if(tokens.length === 0) {
		next();
		return;
	}

	var options = { 
		cert: __dirname + '/../../config/env/apn.pem',
		key:  __dirname + '/../../config/env/apn.pem',
		production: false
	};

    var apnConnection = new apn.Connection(options);

	console.log('---Sending APN to ' + tokens.join());
	var i;
	for(i =0 ; i < tokens.length; i++) {
		var note = new apn.Notification();
		var myDevice = new apn.Device(tokens[i]);

		note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
		note.badge = 0;
		note.sound = "ping.aiff";
		note.alert = data.message;
		note.payload = data;

		apnConnection.pushNotification(note, myDevice);
	}

	next();
};

exports.sendNotification = function(userId, data, next) {
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

			sendGSM(android, data, function() {
				sendAPN(ios, data, function() {
					next();
				});
			});
		})
		.error(function(err) {
			console.log(err);
			next();
		});
};