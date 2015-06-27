var config    = require('../../config/config');
var braintree = require('braintree');

var gateway = braintree.connect({
  environment: config.braintree.SANDBOX ? braintree.Environment.Sandbox : braintree.Environment.Production,
  merchantId: config.braintree.MERCHANT_ID,
  publicKey: config.braintree.PUBLIC_KEY,
  privateKey: config.braintree.PRIVATE_KEY
});
module.exports = gateway;