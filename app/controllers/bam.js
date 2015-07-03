var db = require('../../config/sequelize');
var md5 = require('MD5');
var moment = require('moment');
var async = require('async');
var validator = require('validator');
var mailer = require('../lib/mailer');
var _ = require('lodash');
var config = require('../../config/config');
var braintree = require('../lib/braintree');
var paypal = require('../../config/paypal');

exports.users_index = function(req, res) {
	db.User.findAll({status: {ne: 'DELETED'}})
		.success(function(users) {
			return res.send({
				code: 'OK',
				users: users
			});
		})
		.error(function(err) {
			console.log(err);
			return res.status(401).send({ 
		        error: 'Unexpected error occured.',
		        code: 'UNEXPECTED_ERROR'
		      });
		});
};

exports.users_create = function(req, res) {
	if(!req.body.type) {
		return res.status(400).send({ 
			error: 'Please select user type.',
			code: 'EMPTY_TYPE'
		});
	}
	if(req.body.type != 'ADMIN' && req.body.type != 'SRS' && req.body.type != 'DRIVER') {
		return res.status(400).send({ 
			error: 'Invalid user type.',
			code: 'INVALID_TYPE'
		});
	}
	if(!req.body.firstname) {
		if(req.body.type == 'SRS') {
			return res.status(400).send({ 
				error: 'Please enter business name.',
				code: 'EMPTY_BUSINESSNAME'
			});
		}
		else {
			return res.status(400).send({ 
				error: 'Please enter first name.',
				code: 'EMPTY_FIRSTNAME'
			});
		}
	}
	if(req.body.type != 'SRS' && !req.body.lastname) {
		return res.status(400).send({ 
		error: 'Please enter last name.',
		code: 'EMPTY_LASTNAME'
		});
	}
	if(!req.body.email) {
		return res.status(400).send({ 
		error: 'Please enter email address.',
		code: 'EMPTY_EMAIL'
		});
	}
	if(!req.body.password || req.body.password.length < 6) {
		return res.status(400).send({ 
			error: 'Passwords must be at least 6 charactors.',
			code: 'INVALID_PASSWORD'
		}); 
	}

	if(req.body.type == 'SRS' && (!req.body.address || !req.body.latitude || !req.body.longitude)) {
		return res.status(400).send({ 
			error: 'Please enter your address.',
			code: 'EMPTY_ADDRESS'
		}); 
	}

	if(req.body.password) {
		req.body.salt = req.user.makeSalt();
		req.body.hashedPassword = req.user.encryptPassword(req.body.password, req.user.salt);
	}

	req.body.status = 'ACTIVE';

	db.User.create(req.body).success(function(user){
		return res.send({
			error: '',
			code: 'OK',
			user: user
		});
	}).error(function(err){
		console.log(err);
		return res.status(400).send({ 
		  error: "Unexpected error.",
		  code: "UNEXPECTED_ERROR"
		});
	});
};

exports.users_update = function(req, res) {
	if(!req.body.type) {
		return res.status(400).send({ 
			error: 'Please select user type.',
			code: 'EMPTY_TYPE'
		});
	}
	if(req.body.type != 'ADMIN' && req.body.type != 'SRS' && req.body.type != 'DRIVER') {
		return res.status(400).send({ 
			error: 'Invalid user type.',
			code: 'INVALID_TYPE'
		});
	}
	if(!req.body.firstname) {
		if(req.body.type == 'SRS') {
			return res.status(400).send({ 
				error: 'Please enter business name.',
				code: 'EMPTY_BUSINESSNAME'
			});
		}
		else {
			return res.status(400).send({ 
				error: 'Please enter first name.',
				code: 'EMPTY_FIRSTNAME'
			});
		}
	}
	if(req.body.type != 'SRS' && !req.body.lastname) {
		return res.status(400).send({ 
		error: 'Please enter last name.',
		code: 'EMPTY_LASTNAME'
		});
	}
	if(!req.body.email) {
		return res.status(400).send({ 
		error: 'Please enter email address.',
		code: 'EMPTY_EMAIL'
		});
	}
	if(req.body.password && req.body.password.length < 6) {
		return res.status(400).send({ 
			error: 'Passwords must be at least 6 charactors.',
			code: 'INVALID_PASSWORD'
		}); 
	}

	if(req.body.type == 'SRS' && (!req.body.address || !req.body.latitude || !req.body.longitude)) {
		return res.status(400).send({ 
			error: 'Please enter your address.',
			code: 'EMPTY_ADDRESS'
		}); 
	}

	if(req.body.password) {
		req.body.salt = req.user.makeSalt();
		req.body.hashedPassword = req.user.encryptPassword(req.body.password, req.user.salt);
	}

	db.User.find({ where: {id: req.params.id} }).success(function(user){
        if(!user) {
            return res.status(400).send({
                error: 'user not found.', 
                code: 'INVALID_USER_ID'
            });
        } else {
        	user.updateAttributes(req.body)
        		.success(function(user) {
        			return res.send({
						error: '',
						code: 'OK',
						user: user
					});
        		}).error(function(err){
					console.log(err);
					return res.status(400).send({ 
					  error: "Unexpected error.",
					  code: "UNEXPECTED_ERROR"
					});
				});   
        }
    }).error(function(err){
        return res.status(400).send({
            error: 'user not found.', 
            code: 'INVALID_USER_ID'
        });
    });
};

exports.users_get = function(req, res) {
	db.User.find({ where: {id: req.params.id} }).success(function(user){
        if(!user) {
            return res.status(400).send({
                error: 'user not found.', 
                code: 'INVALID_USER_ID'
            });
        } else {
			return res.send({
				error: '',
				code: 'OK',
				user: user
			});
        }
    }).error(function(err){
        return res.status(400).send({
            error: 'user not found.', 
            code: 'INVALID_USER_ID'
        });
    });
};

exports.payments_index = function(req, res) {
	db.Payment.findAll({ 
			where: {UserId: req.user.id}, 
			include: [ 
				{
					model: db.PaymentItem, 
					include: [
						{
							model: db.Order
						}
					]
				}
			],
			order: [['dateStart', 'DESC']]
		})
		.success(function(payments) {
			var operations = [];
			var results = [];
			_.each(payments, function(payment, i) {
				_.each(payment.paymentItems, function(item, j) {
					operations.push(function(next) {
						item.order.json(function(order) {
							payments[i].paymentItems[j].dataValues.order = order;
							next();
						});
					});
				});
			});
			async.series(operations, function() {
				return res.send({
					error: '',
					code: 'OK',
					payments: payments
				});
			});
		})
		.error(function(err) {
			console.log(err);
			return res.status(400).send({ 
			  error: "Unexpected error.",
			  code: "UNEXPECTED_ERROR"
			});
		});
};
exports.payments_get = function(req, res) {
	db.Payment.find({ 
			where: {id: req.params.id}, 
			include: [ 
				{
					model: db.PaymentItem, 
					include: [
						{
							model: db.Order
						}
					]
				}
			]
		})
		.success(function(payment) {
			var operations = [];
			_.each(payment.paymentItems, function(item, j) {
				operations.push(function(next) {
					item.order.json(function(order) {
						payment.paymentItems[j].dataValues.order = order;
						next();
					});
				});
			});
			async.series(operations, function() {
				return res.send({
					error: '',
					code: 'OK',
					payment: payment
				});
			});
		})
		.error(function(err) {
			console.log(err);
			return res.status(400).send({ 
			  error: "Unexpected error.",
			  code: "UNEXPECTED_ERROR"
			});
		});
};

exports.payments_braintree_token = function(req, res) {
	var generateToken = function() {
		braintree.clientToken.generate({
			customerId: req.user.braintreeCustomerId
		}, function (err, response) {
			res.send(response.clientToken);
		});
	};
	if(!req.user.braintreeCustomerId) {
		braintree.customer.create({}, function(err, result) {
			if(err) {
				console.log(err);
			}
			else {
				req.user.braintreeCustomerId = result.customer.id;
				req.user.save();
				generateToken();
			}
		});
	}
	else {
		generateToken();
	}
};
exports.payments_braintree_driver = function(req, res) {
	merchantAccountParams = req.body;
	merchantAccountParams.tosAccepted = true;
	merchantAccountParams.masterMerchantAccountId = config.braintree.MERCHANT_ID;

	braintree.merchantAccount.create(merchantAccountParams, function (err, result) {
		if(err) {
			console.log(err);
			res.status(400).send({
				error: "There's error occured while processing your request.",
				code: "BRAINTREE_ERROR"
			});
		}
		else {
			req.user.braintreeCustomerId = result.id;
			req.user.braintreePaymentNonce = "";
			req.user.save();
			res.send({

			});
		}
	});
};
exports.braintree_webhook = function (req, res) {
  // res.send(braintree.webhookNotification.verify(req.query.bt_challenge));
  // return;
  braintree.webhookNotification.parse(req.body.bt_signature, req.body.bt_payload, function (err, webhookNotifiction) {
		if(webhookNotification.kind === braintree.webhookNotification.Kind.SubMerchantAccountApproved) {
			db.User.find({where: {braintreeCustomerId: webhookNotification.merchantAccount.id}}).success(function(user) {
		      if(user) {
		    	user.braintreePaymentNonce = "ACTIVE";
		    	user.save();
		      }
		    	res.send({});
		    }).error(function() {
		    	res.send({});
		    });
		}
		else if(webhookNotification.kind === WebhookNotification.Kind.SubMerchantAccountDeclined) {
		    res.send({});
		}
	});
};

exports.payments_paypal_save_card = function(req, res) {
	req.body.payer_id = req.user.id;
	paypal.creditCard.create(req.body, function(error, credit_card){
		if (error) {
			console.log(error);
			res.status(400).send({
				error: "There's error occured while processing your request.",
				detail: error,
				code: "PAYPAL_ERROR"
			});
		} else {
			console.log("Create Credit-Card Response");
			console.log(credit_card);
			if(req.user.braintreeCustomerId) {
				paypal.creditCard.del(req.user.braintreeCustomerId, function(err, no_response) {

				});
			}
			req.user.braintreeCustomerId = credit_card.id;
			req.user.save()
				.success(function() {
					return res.send({
						code: "OK",
						error: "",
						creditcard: credit_card
					});
				})
				.error(function(err) {
					console.log(err);
					return res.status(400).send({ 
					  error: "Unexpected error.",
					  code: "UNEXPECTED_ERROR"
					});					
				});
		}
	});
};
exports.payments_paypal_get_card = function(req, res) {
	if(req.user.braintreeCustomerId) {
		paypal.creditCard.get(req.user.braintreeCustomerId, function(err, credit_card) {
			if(err) {
				console.log(err);
				res.status(400).send({
					error: "There's error occured while processing your request.",
					detail: err,
					code: "PAYPAL_ERROR"
				});
			}
			else {
				return res.send({
						code: "OK",
						error: "",
						creditcard: credit_card
					});
			}
		});
	}
	else {
		return res.send({
			code: "NO_CARD",
			error: "No card added",
			creditcard: null
		});
	}
};
exports.payments_paypal_webhook_cancel = function(req, res) {
	console.log(res.body);
	return res.send({});
};
exports.payments_paypal_webhook_success = function(req, res) {
	console.log(res.body);
	return res.send({});
};
exports.payments_paypal_webhook_ipn = function(req, res) {
	console.log(req.body);
	return res.send({});
};