/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');
var md5 = require('MD5');
var moment = require('moment');
var async = require('async');
var validator = require('validator');
var mailer = require('../lib/mailer');

exports.session = function(req, res, next) {
  var token = req.headers.token;
  if(token !== "" && token !== null && typeof token !== "undefined") {
    db.UserSession.find({where: {sessionToken: token}}).success(function(session) {
      if(session && (session.expiryDate === null || moment(session.expiryDate).unix() > moment().unix() ) ){
        db.User.find({where: {id: session.UserId}}).success(function(user) {
          req.user = user;
          next();
        }).error(function() {
          next();
        });
      }
      else {
        next();
      }
    }).error(function() {
      next();
    });
  }
  else {
    next();
  }
};

/**
 * Logout
 */

exports.signout = function(req, res) {
  req.logout();
  return res.jsonp({
    error: '',
    code: 'OK'
  });
};

exports.failed = function(req, res) {
  return res.status(400).send({ 
      error: "Woops, wrong email or password!",
      code: "INVALID_CREDENTIAL"
  });
};

exports.auth = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var deviceType = req.body.deviceType;
  var deviceToken = req.body.deviceToken;

  db.User.find({ where: { email: email, status: 'ACTIVE' }}).success(function(user) {
    if (!user) {
      return res.status(401).send({ 
        error: 'Woops, wrong email or password.',
        code: 'INVALID_CREDENTIAL'
      });
    } 
    else if(user.facebookId !== "" && user.facebookId !== null && typeof user.facebookId !== "undefined") {
      return res.status(401).send({ 
        error: 'This account is created by Facebook account.',
        code: 'INVALID_CREDENTIAL'
      });
    }
    else if (!user.authenticate(password)) {
      return res.status(401).send({ 
        error: 'Woops, wrong email or password.',
        code: 'INVALID_CREDENTIAL'
      });
    } 
    else if(deviceType && deviceType != "IOS" && deviceType != "ANDROID") {
      return res.status(401).send({ 
        error: 'Invalid Device type.',
        code: 'INVALID_DEVICE_TYPE'
      });
    }
    else {
      console.log('Login (local) : { id: ' + user.id + ', email: ' + user.email + ' }');
      var token = db.UserSession.createSession(user.id);
      if(deviceToken) {
        db.UserDevice.addDevice({
          type: deviceType,
          token: deviceToken,
          UserId: user.id
        });
      }
      return res.send({
        error: '',
        code: 'OK',
        token: token,
        user: user.json()
      });
    }
  }).error(function(err){
    return res.status(400).send({ 
      error: 'Unexpected error.',
      code: 'UNEXPECTED_ERROR'
    });
  });
};

exports.update = function(req, res) {
  
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
  if(req.body.password && req.body.password.length < 6) {
    return res.status(400).send({ 
      error: 'Passwords must be at least 6 charactors.',
      code: 'INVALID_PASSWORD'
    }); 
  }
      

  req.user.firstname = req.body.firstname;
  req.user.lastname = req.body.lastname;
  req.user.address = req.body.address;
  req.user.photo = req.body.photo;
  req.user.phone = req.body.phone;
  if(req.body.password) {
    req.user.salt = req.user.makeSalt();
    req.user.hashedPassword = req.user.encryptPassword(req.body.password, req.user.salt);
  }

  req.user.save().success(function(){
      return res.send({
        error: '',
        code: 'OK',
        user: req.user.json()
      });
    }).error(function(err){
      console.log(err);
      return res.status(400).send({ 
          error: "Unexpected error.",
          code: "UNEXPECTED_ERROR"
      });
    });
};
exports.updateStatus = function(req, res) {
  var onlineStatus = req.body.status;

  if(onlineStatus != "BUSY" && onlineStatus != "ONLINE" && onlineStatus != "OFFLINE" && onlineStatus != "AWAY") {
    return res.status(400).send({ 
      error: 'Invalid status code.',
      code: 'INVALID_STATUS'
    });
  }

  req.user.onlineStatus = onlineStatus;

  req.user.save()
    .success(function() {
      return res.send({
        error: '',
        code: 'OK'
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

exports.updateLocation = function(req, res) {
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;

  req.user.latitude = latitude;
  req.user.longitude = longitude;

  req.user.save()
    .success(function() {
      return res.send({
        error: '',
        code: 'OK'
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

/**
 * Forget password
 */
exports.requestForget = function(req, res) {
  db.User.find({where:{email:req.query.email}})
    .then(function(user) {
      if(!user) {
        return res.status(400).send({ 
          error: 'Email address does not exist.',
          code: 'INVALID_EMAIL'
        });
      }
      else if(user.facebookId !== "" && user.facebookId !== null) {
        return res.status(400).send({ 
          error: 'User account with this email address seems to be created with Open ID.',
          code: 'INVALID_EMAIL'
        });
      }
      else {
        user.token = md5(Date.now());
        user.tokenExpiry = new Date((new Date()).getTime() + 2 * 60 * 60 * 1000); //expire in 2 hours
        user.save().success(function() {

            mailer.email_forget_password(user);

            return res.send({
              error: '',
              code: 'OK'
            });
          })
          .error(function(err) {
            console.log(err);
            return res.status(400).send({ 
                error: "Unexpected error.",
                code: 'UNEXPECTED_ERROR'
            });
          });
      }
    });
};

exports.verifyForget = function(req, res) {
  db.User.find({where:{token:req.body.token}})
    .then(function(user) {
      if(!user) {
        return res.status(400).send({ 
          error: 'Invalid token specified.',
          code: 'INVALID_TOKEN'
        });
      }
      else if(user.tokenExpiry.getTime() <= new Date().getTime()) {
        return res.status(400).send({ 
          error: 'Token has expired. Please try again.',
          code: 'EXPIRED_TOKEN'
        });
      }
      else {
        user.token = '';
        user.tokenExpiry = null;
        user.save()
          .success(function() {
            var token = db.UserSession.createSession(user.id);
            return res.send({
              error: '',
              code: 'OK',
              token: token,
              user: user.json()
            });
          });    
      }
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
  res.jsonp({
    error: '',
    code: 'OK',
    user: req.user.json()
  });
};


exports.user = function(req, res, next, id) {
  db.User.find({where : { id: id}}).success ( function(user) {
    if(!user) return next(new Error("Failed to load User " + id));
    req.profile = user;
    next();
  }).error(function(err) {
    next(err);
  });
};