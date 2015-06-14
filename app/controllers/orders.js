/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');
var _ = require('lodash');
var async = require('async');
var notification = require('../lib/notification');
var twilio = require('../../config/twilio');
var orderman = require('../lib/orderman');

/**
 * Find order by id
 * Note: This is called every time that the parameter :orderId is used in a URL. 
 * Its purpose is to preload the order on the req object then call the next function. 
 */
exports.order = function(req, res, next, id) {
    console.log('id => ' + id);
    db.Order.find({ where: {id: id} }).success(function(order){
        if(!order) {
            return res.status(400).send({
                error: 'order not found.', 
                code: 'INVALID_ORDER_ID'
            });
        } else {
            req.order = order;
            return next();            
        }
    }).error(function(err){
        return res.status(400).send({
            error: 'order not found.', 
            code: 'INVALID_ORDER_ID'
        });
    });
};

/**
 * Create a order
 */
exports.create = function(req, res) {
    // augment the order by adding the UserId
    if(!req.body.pickupAddress) {
        return res.status(400).send({ 
            error: 'Please provide pickup address.',
            code: 'EMPTY_PICKUP_ADDRESS'
        });
    }
    if(!req.body.pickupLatitude) {
        return res.status(400).send({ 
            error: 'Please provide pickup latitude.',
            code: 'EMPTY_PICKUP_LATITUDE'
        }); 
    }
    if(!req.body.pickupLongitude) {
        return res.status(400).send({ 
            error: 'Please provide pickup latitude.',
            code: 'EMPTY_PICKUP_LATITUDE'
        });
    }
    if(!req.body.pickupPhone) {
        return res.status(400).send({ 
            error: 'Please provide pickup phone number.',
            code: 'EMPTY_PICKUP_PHONE'
        });
    }
    if(req.body.paymentType != 'CASH' && req.body.paymentType != 'CREDIT_CARD') {
        return res.status(400).send({ 
            error: 'Please provide valid payment type.',
            code: 'INVALID_PAYMENT_TYPE'
        });
    }
    if(!req.body.paymentAmount || req.body.paymentAmount <= 0) {
        return res.status(400).send({ 
            error: 'Please provide amount.',
            code: 'INVALID_AMOUNT'
        });
    }
    if(!req.body.paymentTip || req.body.paymentTip < 0) {
        return res.status(400).send({ 
            error: 'Please provide valid tip amount.',
            code: 'INVALID_TIP_AMOUNT'
        });
    }
    if(!req.body.dropoffAddress) {
        return res.status(400).send({ 
            error: 'Please provide dropoff address.',
            code: 'EMPTY_DROPOFF_ADDRESS'
        });
    }
    if(!req.body.dropoffLatitude) {
        return res.status(400).send({ 
            error: 'Please provide dropoff latitude.',
            code: 'EMPTY_DROPOFF_LATITUDE'
        });
    }
    if(!req.body.dropoffLongitude) {
        return res.status(400).send({ 
            error: 'Please provide dropoff latitude.',
            code: 'EMPTY_DROPOFF_LATITUDE'
        });
    }
    if(!req.body.dropoffName) {
        return res.status(400).send({ 
            error: 'Please provide customer name.',
            code: 'EMPTY_DROPOFF_NAME'
        });
    }
    if(!req.body.dropoffPhone) {
        return res.status(400).send({ 
            error: 'Please provide customer phone number.',
            code: 'EMPTY_DROPOFF_PHONE'
        });
    }

    req.body.srs_id = req.user.id;
    req.body.driver_id = null;
    req.body.driverCheckList = '[]';
    req.body.status = 'PENDING';
    // save and return and instance of order on the res object. 
    db.Order.create(req.body).success(function(order){
        if(!order){
            return res.status(400).send({ 
                error: "Unexpected error.",
                code: "UNEXPECTED_ERROR"
            });
        } else {

            orderman.startFindDriver(order);

            order.json(function(order) {
                return res.jsonp({
                    code: 'OK',
                    error: '',
                    order: order
                });
            });   
        }
    }).error(function(err){
        console.log(err);
        return res.status(400).send({ 
            error: "Unexpected error.",
            code: "UNEXPECTED_ERROR"
        });
    });
};

/**
 * Update a order
 */
exports.update = function(req, res) {

    // create a new variable to hold the order that was placed on the req object.
    var order = req.order;
    if(order === null) {
        return res.status(400).send({
            error: 'order not found.', 
            code: 'INVALID_ORDER_ID'
        });
    }

    var update = {};

    if(req.body.status) {
        if(req.body.status != 'DRAFTED' && req.body.status != 'PENDING' && req.body.status != 'ACCEPTED' && req.body.status != 'PICKED' && req.body.status != 'COMPLETED' && req.body.status != 'CANCELED') {
            return res.status(400).send({ 
                error: 'Please provide valid status code.',
                code: 'INVALID_ORDER_STATUS_CODE'
            });
        }
        update.status = req.body.status;
    }
    if(req.body.driverId) {
        update.driver_id = req.body.driverId;
    }
    order.updateAttributes(update)
        .success(function(a){
            return res.jsonp({
                code: 'OK',
                error: ''
            });
        }).error(function(err){
            return res.status(400).send({
                error: "Unexpected error.",
                code: "UNEXPECTED_ERROR"
            });
        });
};

/**
 * Delete an order
 */
exports.destroy = function(req, res) {

    // create a new variable to hold the order that was placed on the req object.
    var order = req.order;

    if(order === null) {
        return res.status(400).send({
            error: 'order not found.', 
            code: 'INVALID_ORDER_ID'
        });
    }

    order.updateAttributes({
        status: 'CANCELED'
    }).success(function(a){
        return res.jsonp({
            code: 'OK',
            error: ''
        });
    }).error(function(err){
        return res.status(400).send({
            error: "Unexpected error.",
            code: "UNEXPECTED_ERROR"
        });
    });
};

/**
 * Show an order
 */
exports.show = function(req, res) {
    if(req.order === null) {
        return res.status(400).send({
            error: 'order not found.', 
            code: 'INVALID_ORDER_ID'
        });
    }

    if(req.order.status == 'PENDING') {
        req.order.json(function(order) {
            return res.jsonp({
                code: 'OK',
                error: '',
                order: order
            });
        }); 
    }
    else {
        req.order.json(function(order) {
            return res.jsonp({
                code: 'OK',
                error: '',
                order: order
            });
        }); 
    }
};

/**
 * List of orders
 */
exports.all = function(req, res) {
    var $promise = null;
    if(req.user.type == 'SRS') {
        $promise = req.user.getSRSOrders();
    }
    else if(req.user.type == 'DRIVER') {
        $promise = req.user.getDriverOrders();
    }
    else if(req.user.type == 'ADMIN') {
        $promise = db.Orders.find();
    }
    
    $promise.then(function(orders) {
        var operations = [];
        var result = [];
        _.each(orders, function(order) {
            operations.push(function(next) {
                order.json(function(order) {
                    result.push(order);
                    next();
                });
            });
        });

        async.series(operations, function(err) {
            return res.send({
                error: "",
                code: "",
                orders: result
            });
        });

    }, function(err) {
        console.log(err);
        return res.status(400).send({
            error: "Unexpected error.",
            code: "UNEXPECTED_ERROR",
            orders: []
        });
    });
};

exports.requestDriver = function(req, res) {
    if(req.order === null || (req.order.status != 'FAILED' && req.order.status != 'PENDING') ) {
        return res.status(400).send({
            error: 'order not found.', 
            code: 'INVALID_ORDER_ID'
        });
    }

    orderman.startFindDriver(req.order);

    return res.send({
        error: "",
        code: ""
    });
};

exports.acceptOrder = function(req, res) {
    if(req.order === null || req.order.status != 'PENDING') {
        return res.status(400).send({
            error: 'order not found.', 
            code: 'INVALID_ORDER_ID'
        });
    }

    req.order.status = 'ACCEPTED';
    req.order.driver_id = req.user.id;

    req.order.save()
        .success(function(a){
            req.order.json(function(order) {
                notification.sendNotification(req.order.srs_id, {
                    type: 'ORDER_ACCEPTED',
                    message: req.user.firstname + ' ' + req.user.lastname + ' has accepted your request.',
                    data: {
                        order: order,
                        driverId: req.user.id
                    }
                }, function() {
                    return res.jsonp({
                        code: 'OK',
                        error: ''
                    });
                });     
            });       
        }).error(function(err){
            return res.status(400).send({
                error: "Unexpected error.",
                code: "UNEXPECTED_ERROR"
            });
        });
};

exports.denyOrder = function(req, res) {
    if(req.order === null || req.order.status != 'PENDING') {
        return res.status(400).send({
            error: 'order not found.', 
            code: 'INVALID_ORDER_ID'
        });
    }
    var driverId = null;
    // if(req.user.type == 'DRIVER') {
        driverId = req.user.id;
    // }
    // else {
        // driverId = req.body.driverId;
    // }

    orderman.findNextDriver(req.order, driverId);

    req.order.save()
        .success(function(a){
            req.order.json(function(order) {
                notification.sendNotification(req.order.srs_id, {
                    type: 'ORDER_DENIED',
                    message: req.user.firstname + ' ' + req.user.lastname + ' has denied your request.',
                    data: {
                        order: order,
                        driverId: req.user.id
                    }
                }, function() {
                    return res.jsonp({
                        code: 'OK',
                        error: ''
                    });
                });
            });  
        }).error(function(err){
            return res.status(400).send({
                error: "Unexpected error.",
                code: "UNEXPECTED_ERROR"
            });
        });
};

exports.reviewDriver = function(req, res) {
    if(req.order === null) {
        return res.status(400).send({
            error: 'Order not found.', 
            code: 'INVALID_ORDER_ID'
        });
    }
    if(req.order.status != 'COMPLETED') {
        return res.status(400).send({
            error: 'You can write review on this order.', 
            code: 'INVALID_ORDER_ID'
        });
    }
    if( !req.body.rating || req.body.rating < 0 || req.body.rating > 5) {
        return res.status(400).send({
            error: 'Please provide rating between 0 to 5.', 
            code: 'INVALID_RATING'
        });
    }
    if( !req.body.comment || req.body.comment === "") {
        return res.status(400).send({
            error: 'Please provide comment.', 
            code: 'EMPTY_COMMENT'
        });
    }

    db.Review.find({where: {UserId: req.order.driver_id, OrderId: req.order.id}})
        .success(function(review) {
            if(review) {
                return res.status(400).send({
                    error: 'You have already written review on this order.', 
                    code: 'DUPLICATED_REVIEW'
                });
            }
            else {
                db.Review.create({
                    UserId: req.order.driver_id,
                    OrderId: req.order.id,
                    rating: req.body.rating,
                    comment: req.body.comment
                }).success(function(review) {
                    return res.status(400).send({
                        error: "",
                        code: "OK"
                    });
                }).error(function(err){
                    return res.status(400).send({
                        error: "Unexpected error.",
                        code: "UNEXPECTED_ERROR"
                    });
                });
            }
        }).error(function(err){
            return res.status(400).send({
                error: "Unexpected error.",
                code: "UNEXPECTED_ERROR"
            });
        });
};


exports.cancelOrder = function(req, res) {
    if(req.order === null || req.order.driver_id != req.user.id) {
        return res.status(400).send({
            error: 'Order not found.', 
            code: 'INVALID_ORDER_ID'
        });
    }

    req.order.driver_id = null;
    req.order.status = 'PENDING';

    var list = JSON.parse(req.order.driverCheckList);
    list.push(req.user.id);
    req.order.driverCheckList = JSON.stringify(list);

    req.order.save()
        .success(function(review) {
            req.order.json(function(order) {
                notification.sendNotification(req.order.srs_id, {
                    type: 'ORDER_CANCELED',
                    message: req.user.firstname + ' ' + req.user.lastname + ' has canceled the delivery.',
                    data: {
                        order: order,
                        driverId: req.user.id
                    }
                }, function() {
                    return res.jsonp({
                        code: 'OK',
                        error: ''
                    });
                });
            }); 
        }).error(function(err){
            return res.status(400).send({
                error: "Unexpected error.",
                code: "UNEXPECTED_ERROR"
            });
        });
};
exports.pickupOrder = function(req, res) {
    if(req.order === null || req.order.status != 'ACCEPTED' || req.order.driver_id != req.user.id) {
        return res.status(400).send({
            error: 'Order not found.', 
            code: 'INVALID_ORDER_ID'
        });
    }

    req.order.status = 'PICKED';

    req.order.save()
        .success(function(review) {
            req.order.json(function(order) {
                notification.sendNotification(req.order.srs_id, {
                    type: 'ORDER_PICKEDUP',
                    message: req.user.firstname + ' ' + req.user.lastname + ' has picked up your order.',
                    data: {
                        order: order,
                        driverId: req.user.id
                    }
                }, function() {
                    return res.jsonp({
                        code: 'OK',
                        error: ''
                    });
                }); 
            });
        }).error(function(err){
            return res.status(400).send({
                error: "Unexpected error.",
                code: "UNEXPECTED_ERROR"
            });
        });
};
exports.almostThereOrder = function(req, res) {
    if(req.order === null || req.order.status != 'PICKED' || req.order.driver_id != req.user.id) {
        return res.status(400).send({
            error: 'Order not found.', 
            code: 'INVALID_ORDER_ID'
        });
    }

    req.order.json(function(order) {
        notification.sendNotification(req.order.srs_id, {
            type: 'ORDER_2MIN_AWAY',
            message: 'Your order has almost delivered. Just 2 mins away.',
            data: {
                order: order,
                driverId: req.user.id
            }
        }, function() {

            twilio.sendMessage({
                to: req.order.srs_id,
                body: 'Your order has almost delivered. Just 2 mins away.'
            }, function(err, responseData) {
                return res.jsonp({
                    code: 'OK',
                    error: ''
                });
            });
        });
    });
};

exports.dropoffOrder = function(req, res) {
    if(req.order === null || req.order.status != 'PICKED' || req.order.driver_id != req.user.id) {
        return res.status(400).send({
            error: 'Order not found.', 
            code: 'INVALID_ORDER_ID'
        });
    }

    req.order.save()
        .success(function(review) {
            req.order.json(function(order) {
                notification.sendNotification(req.order.srs_id, {
                    type: 'ORDER_DROPPEDOFF',
                    message: req.user.firstname + ' ' + req.user.lastname + ' has dropped off your order.',
                    data: {
                        order: order,
                        driverId: req.user.id
                    }
                }, function() {
                    return res.jsonp({
                        code: 'OK',
                        error: ''
                    });
                }); 
            });
        }).error(function(err){
            return res.status(400).send({
                error: "Unexpected error.",
                code: "UNEXPECTED_ERROR"
            });
        });
};


exports.completeOrder = function(req, res) {
    if(req.order === null || req.order.status != 'PICKED' || req.order.driver_id != req.user.id) {
        return res.status(400).send({
            error: 'Order not found.', 
            code: 'INVALID_ORDER_ID'
        });
    }
    
    req.order.status = 'COMPLETED';
    req.order.save()
        .success(function(review) {
            return res.jsonp({
                code: 'OK',
                error: ''
            });
        }).error(function(err){
            return res.status(400).send({
                error: "Unexpected error.",
                code: "UNEXPECTED_ERROR"
            });
        });
};