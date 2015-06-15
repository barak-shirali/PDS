var db = require('../../config/sequelize');
var _ = require('lodash');
var async = require('async');
var config    = require('../../config/config');
var notification = require('./notification');


var getNearestDrivers = function(latitude, longitude, denied_drivers, count, next) {
    denied_drivers.push(0);
    db.sequelize.query('SELECT * FROM Users WHERE Users.id NOT IN ' + '(' + denied_drivers.join() + ')' + ' AND Users.status = "ACTIVE" and Users.type = "DRIVER" AND haversineDistance(' + latitude + ', ' + longitude + ', Users.latitude, Users.longitude) <= 80467.2 ORDER BY haversineDistance(' + latitude + ', ' + longitude + ', Users.latitude, Users.longitude) ASC LIMIT 0, ' + count, db.User)
        .then(function(users) {
            next(users);
        }, function(err) {
            console.log(err);
            next(null);
        });
};

var startFindDriver = function(order) {
	order.driverCheckList = '[]';
	order.status = 'PENDING';
	order.save()
		.success(function() {
			findNextDriver(order, null);
		})
		.error(function() {
			// shoud not reach here
		});
};

var findNextDriver = function(order, denyingDriverId) {
	db.Order.find({ where: {id: order.id} }).success(function(order){
        if(!order) {
        } else {
        	if(order.status != 'PENDING') return;

        	var list = JSON.parse(order.driverCheckList);

			if(denyingDriverId !== null) {
				if(list.indexOf(denyingDriverId) !== -1) return;

				list.push(denyingDriverId);
				order.driverCheckList = JSON.stringify(list);
			}

			order.save().success(function() {
				order.getSRS().then(function(srs) {
					getNearestDrivers(srs.latitude, srs.longitude, list, 10, function(driver) {
						order.json(function(orderJSON) {
							if(driver === null || driver.length === 0) {
								//failed
								order.status = 'FAILED';
								order.save();
								notification.sendNotification(srs.id, {
				                    type: 'ORDER_FAILED',
				                    message: 'We could not find any available driver for your order.',
				                    data: {
				                        order: orderJSON
				                    }
				                }, function() {
				                });
							}
							else {
								driver = driver[0];
								//request
								notification.sendNotification(driver.id, {
				                    type: 'ORDER_REQUEST',
				                    message: 'You received a delivery request.',
				                    data: {
				                        order: orderJSON,
                        				orderId: order.id
				                    }
				                }, function() {
				                	setTimeout(function() {
				                		findNextDriver(order, driver.id);
				                	}, config.DRIVER_WAITING_TIME * 1000);
				                });
							}
						});
					});
				});
			})
			.error(function() {
				// shoud not reach here
			});  
        }
    }).error(function(err){
    });
};

module.exports = {
	startFindDriver: startFindDriver,
	findNextDriver: findNextDriver
};