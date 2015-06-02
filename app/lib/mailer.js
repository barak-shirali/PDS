var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var http = require('http');

var config    = require('../../config/config');

var send_email = function(email) {

	var transport = nodemailer.createTransport(smtpTransport({
	    host: config.smtp.host,
	    port: config.smtp.port,
	    auth: {
	        user: config.smtp.username,
	        pass: config.smtp.password
	    }
	}));

	transport.sendMail(email);

};
exports.email = function(email) {
	send_email(email);
};

exports.email_forget_password = function(param) {
	send_email({
		from: config.app.admin_name + "<" + config.app.admin_email + ">",
		to: param.email,
		subject: "You have requested to reset your password.",
		html: "Please click the following link to reset your password. <a href='" + config.hostname + "/#!/reset_password/" + param.token + "'>Reset my password</a>"
	});
};


exports.email_welcome = function(param) {
	send_email({
		from: config.app.admin_name + "<" + config.app.admin_email + ">",
		to: param.email,
		subject: "Welcome to "+ config.app.name + "!",
		html: "Welcome!"
	});
};