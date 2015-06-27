var env             = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config          = require('./config/config');
var db              = require('./config/sequelize');
var moment			= require('moment');
var _ = require('lodash');
var async = require('async');

var date = moment().subtract(1, 'days').startOf('week');
var dateStart = date.format('YYYY-MM-DD');
date.add(7, 'days');
var dateEnd = date.format('YYYY-MM-DD');

var createOrGetPayment = function(UserId, dateStart, dateEnd, next) {
	db.Payment.find({ where: {UserId: UserId, dateStart: dateStart, dateEnd: dateEnd} }).success(function(payment){
        if(!payment) {
        	db.Payment.create({
        		dateStart: dateStart,
        		dateEnd: dateEnd,
        		UserId: UserId,
        		apiResponse: ''
        	}).success(function(payment){
		        if(!payment){
		        	console.log('Payment is null');
    				next(null);
		        } else {
		        	next(payment);
		        }
		    }).error(function(err){
		        console.log(err);
    			next(null);
		    });
        } else {
        	next(payment);
        }
    }).error(function(err){
    	console.log(err);
    	next(null);
    });
};

var addPaymentItem = function(payment, order, fee, next) {
	if(order.paymentType == 'CASH') {
		payment.totalCash += order.paymentAmount;
	}
	else {
        payment.totalCreditCard += order.paymentAmount;
	}
	payment.totalTip += order.paymentTip;
	payment.totalFee += 10;
	payment.totalAmount = payment.totalTip + payment.totalFee - payment.totalCash;
    if(fee) {
        payment.serviceFee = payment.totalAmount * config.FEE / 100.0;
        payment.totalAmount -= payment.serviceFee;
    }
    else {
        payment.serviceFee = 0;
    }
	payment.save()
		.success(function() {
			db.PaymentItem.create({
				PaymentId: payment.id,
				OrderId: order.id
			}).success(function() {
				next();
			})
			.error(function() {
				next();
			});
		})
		.error(function() {
			next();
		});
};


db.sequelize.query('select * from Orders where `status` = "COMPLETED" and Orders.id not in (select OrderId from PaymentItems) order by updatedAt ASC', db.Order)
    .then(function(orders) {
    	var operations = [];
    	_.each(orders, function(order) {
    		operations.push(function(next) {
    			createOrGetPayment(order.srs_id, dateStart, dateEnd, function(payment) {
    				if(payment) addPaymentItem(payment, order, false, next);
    				else next();
	    		});
    		});
            operations.push(function(next) {
                createOrGetPayment(order.driver_id, dateStart, dateEnd, function(payment) {
                    if(payment) addPaymentItem(payment, order, true, next);
                    else next();
                });
            });
    	});
    	async.series(operations, function() {
    		console.log('completed');
    	});
    }, function(err) {
        console.log(err);
        next(null);
    });