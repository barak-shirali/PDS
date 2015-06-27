var Paypal = require('paypal-adaptive');
var config = require('./config');

module.exports = new Paypal(config.paypal_classic);