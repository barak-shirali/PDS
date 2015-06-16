var db = require('../../config/sequelize');
var md5 = require('MD5');
var moment = require('moment');
var async = require('async');
var validator = require('validator');
var mailer = require('../lib/mailer');

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
		return res.status(400).send({ 
		error: 'Please enter first name.',
		code: 'EMPTY_FIRSTNAME'
		});
	}
	if(!req.body.lastname) {
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
		return res.status(400).send({ 
		error: 'Please enter first name.',
		code: 'EMPTY_FIRSTNAME'
		});
	}
	if(!req.body.lastname) {
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