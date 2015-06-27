var paypal = require('paypal-rest-sdk');
var config = require('./config');

paypal.configure(config.paypal);

module.exports = paypal;