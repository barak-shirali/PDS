var env             = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config          = require('./config/config');
var paypal          = require('./config/paypal');
var paypalClassic          = require('./config/paypal_classic');
var db              = require('./config/sequelize');
var moment			= require('moment');
var _ = require('lodash');
var async = require('async');

db.Payment.findAll({where: {status: {ne: 'PAID'}}, include:[db.User]})
	.success(function(payments) {
		var transactions = {};

		_.each(payments, function(payment) {
			console.log('****************************************************');
			console.log(payment.user.braintreeCustomerId);
			if(!payment.user.braintreeCustomerId) return;

			var transaction = {
				type: payment.user.type,
				token: payment.user.braintreeCustomerId,
				amount: payment.totalAmount,
				user: payment.user.id,
				payments: [payment]
			};
			if(typeof transactions[payment.user.braintreeCustomerId] === "undefined") {
				transactions[payment.user.braintreeCustomerId] = transaction;
			}
			else {
				transactions[payment.user.braintreeCustomerId].amount += transaction.amount;
				transactions[payment.user.braintreeCustomerId].payments.push(payment);
			}
		});

		_.each(transactions, function(transaction) {
			if(transaction.type == 'SRS') {
				console.log('*******Collecting funds from ' + transaction.token + '**********');
				var savedCard = {
					"intent": "sale",
					"payer": {
						"payment_method": "credit_card",
						"funding_instruments": [{
					    	"credit_card_token": {
					        	"credit_card_id": transaction.token,
					        	"payer_id": transaction.user
					    	}
						}]
					},
					"transactions": [{
						"amount": {
					    	"currency": "USD",
					    	"total": parseFloat(Math.round(transaction.amount * 100) / 100).toFixed(2)
						},
						"description": "Remit system weekly billing."
					}]
				};
				paypal.payment.create(savedCard, function (error, payment) {
					if (error) {
						console.log("Error occured");
						console.log(error);
					} else {
						console.log("Pay with stored card Response");
						console.log(JSON.stringify(payment));
					}
					_.each(transaction.payments, function(pi) {
						if(error) {
							pi.status = 'FAILED';
							pi.apiResponse = JSON.stringify(error);
							pi.save();
						}
						else {
							pi.status = 'PAID';
							pi.apiResponse = JSON.stringify(payment);
							pi.save();
						}
					});
				});
			}
			else if(transaction.type == 'DRIVER') {
				console.log('*******Sending $' + transaction.amount + ' to ' + transaction.token + '**********');
				var payload = {
				    requestEnvelope: {
				        errorLanguage:  'en_US'
				    },
				    senderEmail: config.PAYPAL_BUSINESS_ACCOUNT,
				    actionType:     'PAY',
				    currencyCode:   'USD',
				    memo:           'Remit system weekly billing',
				    // cancelUrl:      config.hostname + '/bam/payments/paypal/webhook/cancel',
				    // returnUrl:      config.hostname + '/bam/payments/paypal/webhook/success',
				    // ipnNotificationUrl: config.hostname + '/bam/payments/paypal/webhook/ipn',
				    cancelUrl:      'http://26006a32.ngrok.com/bam/payments/paypal/webhook/cancel',
				    returnUrl:      'http://26006a32.ngrok.com/bam/payments/paypal/webhook/success',
				    ipnNotificationUrl: 'http://26006a32.ngrok.com/bam/payments/paypal/webhook/ipn',
				    receiverList: {
				        receiver: [
				            {
				                email:  transaction.token,
				                amount: parseFloat(Math.round(transaction.amount * 100) / 100).toFixed(2)
				            }
				        ]
				    }
				};

				paypalClassic.pay(payload, function (error, response) {
				    if (error) {
				        console.log(error);
				        console.log(response);
				    } else {
				        // Response will have the original Paypal API response
				        console.log(response);
				    }
				    _.each(transaction.payments, function(pi) {
						if(error) {
							pi.status = 'FAILED';
							pi.apiResponse = JSON.stringify(error);
							pi.save();
						}
						else {
							pi.status = 'PAID';
							pi.apiResponse = JSON.stringify(response);
							pi.save();
						}
					});
				});
			}
		});
	})
	.error(function(err) {
		console.log(err);
	});