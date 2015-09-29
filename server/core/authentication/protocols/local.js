var validator = require('validator');
var crypto    = require('crypto');
var Query = function(success, fail){
    return function(err, items){
      if(err) return fail(err);
      success(items);
    };
};
/**
 * Local Authentication Protocol
 *
 * The most widely used way for websites to authenticate users is via a username
 * and/or email as well as a password. This module provides functions both for
 * registering entirely new users, assigning passwords to already registered
 * users and validating login requesting.
 *
 * For more information on local authentication in Passport.js, check out:
 * http://passportjs.org/guide/username-password/
 */

/**
 * Register a new user
 *
 * This method creates a new user from a specified email, username and password
 * and assign the newly created user a local Passport.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
exports.register = function (req, res, next) {    // register to myco

  function fail(err) {
    res.json({success: false, error: err});
  }

  var email    = req.param('email'),
        firstName = req.param('firstName'),
        lastName = req.param('lastName'),
        password = req.param('password'),
        extension = req.param('extension'),
        mobile = req.param('mobile');

    var passportItem = {
        protocol    : 'local',
        password    : password
    };
    var userItem = {
        email    : email,
        firstName: firstName,
        lastName: lastName,
        mobile    : mobile
    };

    if (!email) {
        req.flash('error', 'Error.Passport.Email.Missing');
        return next(new Error('No email was entered.'));
    }

    if (!mobile) {
        req.flash('error', 'Error.Passport.Mobile.Missing');
        return next(new Error('No mobile number was entered.'));
    }

    if (!password) {
        req.flash('error', 'Error.Passport.Password.Missing');
        return next(new Error('No password was entered.'));
    }

    User.find({email: email}, Query(function(items){      // make sure the email is not occupied
        if(items && items.length){
            req.flash('error', 'EmailAlreadyExists');
            return next(new Error('email already exists'));
        }
      console.log('user email is free');
        Extension.find({extId: extension}, Query(function(items){    // FIX ME make sure the extension exists, and is not connected to another user
            if(!items || !items.length) {
              req.flash('error', 'ExtensionNotFound');
              return next(new Error('extension ' + extension + ' does not exist.'));
            }
          /*
          *     TODO: check with asterisk that this extension is available.
          * */

            User.create(userItem, function (err, user) {           // create a new user
              if (err) {
                  console.log(err);
                  if (err.code === 'E_VALIDATION') {
                      if (err.invalidAttributes.email) {
                          req.flash('error', 'Error.Passport.Email.Exists');
                      } else if (err.invalidAttributes.mobile) {
                          req.flash('error', 'Error.Passport.Mobile.Invalid');
                      }
                      else{
                          req.flash('error', 'Error.Passport.Invalid');
                      }
                  }
                  return next(err);
              }
              UserExtConnection.findOne({extId: extension}, Query(function(item){
                if(item){
                  return fail('ExtensionOccupied');
                }
                UserExtConnection.create({              // create a new user / extension connection
                  userId: user.id,
                  extId: extension
                }, Query(function(userExtConnection){
                  var token = crypto.randomBytes(48).toString('base64');
                  passportItem.user = user.id;
                  passportItem.accessToken = token;
                  Passport.create(passportItem, function (err, passport) {       // create a local passport for the user
                    if (err) {
                      if (err.code === 'E_VALIDATION') {
                        req.flash('error', 'Error.Passport.Password.Invalid');
                      }
                      return user.destroy(function (destroyErr) {
                        next(destroyErr || err);
                      });
                    }
                    next(null, user);
                  });
                }, fail));
              }, fail));

            });
        }, fail));
    }, fail));
};

/**
 * Assign local Passport to user
 *
 * This function can be used to assign a local Passport to a user who doens't
 * have one already. This would be the case if the user registered using a
 * third-party service and therefore never set a password.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
exports.connect = function (req, res, next) {
  var user     = req.user
    , password = req.param('password');

  Passport.findOne({
    protocol : 'local'
    , user     : user.id
  }, function (err, passport) {
    if (err) {
      return next(err);
    }

    if (!passport) {
      Passport.create({
        protocol : 'local'
        , password : password
        , user     : user.id
      }, function (err, passport) {
        next(err, user);
      });
    }
    else {
      next(null, user);
    }
  });
};

/**
 * Validate a login request
 *
 * Looks up a user using the supplied identifier (email or username) and then
 * attempts to find a local Passport associated with the user. If a Passport is
 * found, its password is checked against the password supplied in the form.
 *
 * @param {Object}   req
 * @param {string}   identifier
 * @param {string}   password
 * @param {Function} next
 */
exports.login = function (req, identifier, password, next) {
  var isEmail = validator.isEmail(identifier)
    , query   = {};

  if (isEmail) {
    query.email = identifier;
  }
  else {
    query.username = identifier;
  }

  User.findOne(query, function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      if (isEmail) {
        req.flash('error', 'Error.Passport.Email.NotFound');
      } else {
        req.flash('error', 'Error.Passport.Username.NotFound');
      }

      return next(null, false);
    }

    Passport.findOne({
      protocol : 'local'
      , user     : user.id
    }, function (err, passport) {
      if (passport) {
        passport.validatePassword(password, function (err, res) {
          if (err) {
            return next(err);
          }

          if (!res) {
            req.flash('error', 'Error.Passport.Password.Wrong');
            return next(null, false);
          } else {
            return next(null, user);
          }
        });
      }
      else {
        req.flash('error', 'Error.Passport.Password.NotSet');
        return next(null, false);
      }
    });
  });
};
