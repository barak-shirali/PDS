/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');
var md5 = require('MD5');
var async = require('async');
var validator = require('validator');
var mailer = require('../lib/mailer');

/**
 * Logout
 */
exports.signout = function(req, res) {
  req.logout();
  return res.jsonp({
    error: '',
    code: ''
  });
};

exports.failed = function(req, res) {
  return res.status(400).send({ 
      error: "Woops, wrong email or password!",
      code: "INVALID_CREDENTIAL"
  });
};

/**
 * func user
 */
exports.create = function(req, res) {
    if(req.body.firstname === "") {
      return res.status(400).send({ 
        error: 'Please enter first name.',
        code: 'EMPTY_FIRSTNAME'
      });
    }
    if(req.body.lastname === "") {
      return res.status(400).send({ 
        error: 'Please enter last name.',
        code: 'EMPTY_LASTNAME'
      });
    }
    if(req.body.email === '') {
      return res.status(400).send({ 
        error: 'Please enter email address.',
        code: 'EMPTY_EMAIL'
      }); 
    }
    if( !validator.isEmail(req.body.email) ) {
        return res.status(400).send({ 
          error: 'Please enter valid email address.',
          code: 'INVALID_EMAIL'
        });
    }
    if(req.body.password === null || req.body.password.length < 6) {
      return res.status(400).send({ 
        error: 'Passwords must be at least 6 charactors.',
        code: 'INVALID_PASSWORD'
      }); 
    }


    var user = db.User.build({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      dob: req.body.dob,
      email: req.body.email,
      photo: req.body.photo,
      status: 0,
      verification: md5(Date.now())
    });

    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(req.body.password, user.salt);
    
    db.User.find({where:{email:user.email}})
      .then(function(result) {
        if(result) {
          return res.status(400).send({ 
            error: email:['Email address is already in use.']},
            code: 400
          });
        }

        user.save().success(function(){
          mailer.email_welcome(user);
          
          req.login(user, function(err){
            res.jsonp(user);
          });
        }).error(function(err){
          return res.status(400).send({ 
              errors: err,
              code: 400
          });
        });
      });

};

exports.update = function(req, res) {
  
  if(req.body.firstname === "") {
    return res.status(400).send({ 
      error: 'Please enter first name.',
      code: 'EMPTY_FIRSTNAME'
    });
  }
  if(req.body.lastname === "") {
    return res.status(400).send({ 
      error: 'Please enter last name.',
      code: 'EMPTY_LASTNAME'
    });
  }
  if(req.body.password === null || req.body.password.length < 6) {
    return res.status(400).send({ 
      error: 'Passwords must be at least 6 charactors.',
      code: 'INVALID_PASSWORD'
    }); 
  }
      

  req.user.firstname = req.body.firstname;
  req.user.surname = req.body.surname;
  req.user.photo = req.body.photo;
  if(req.body.password !== null && req.body.password !== "") {
    req.user.salt = req.user.makeSalt();
    req.user.hashedPassword = req.user.encryptPassword(req.body.password, req.user.salt);
  }

  req.user.save().success(function(){
      res.jsonp(req.user);
    }).error(function(err){
      return res.status(400).send({ 
          error: "Unexpected error",
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
          error: email:['Email address does not exist.']},
          code: 400
        });
      }
      else if(user.facebookId !== "" && user.facebookId !== null) {
        return res.status(400).send({ 
          error: email:['User account with this email address seems to be created with Open ID.']},
          code: 400
        });
      }
      else {
        user.token = md5(Date.now());
        user.tokenExpiry = new Date((new Date()).getTime() + 2 * 60 * 60 * 1000); //expire in 2 hours
        user.save().success(function() {

            mailer.email_forget_password(user);

            return res.send({
              
            });
          })
          .error(function(err) {
            return res.status(400).send({ 
                errors: err,
                code: 400
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
          error: token:['Invalid token specified.']},
          code: 400
        });
      }
      else if(user.tokenExpiry.getTime() <= new Date().getTime()) {
        return res.status(400).send({ 
          error: email:['Token has expired. Please try again.']},
          code: 400
        });
      }
      else {
        user.token = '';
        user.tokenExpiry = null;
        user.save()
          .success(function() {
            req.login(user, function(err){
              res.jsonp(user);
            });
          });        
      }
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
  res.jsonp(req.user);
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