
/*

  local strategy for logging in.

*/

var bcrypt = require('bcryptjs');
var LocalStrategy = require('passport-local').Strategy;

var options = {    // these are the fields checked by passport on the request body
  usernameField: 'email',
  passwordField: 'password'
};

module.exports = function(api){
  return new LocalStrategy(options, function(email, password, done) {
    api.models.user.findOne({ email: email }, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect email.' });
      api.models.passport.findOne({ protocol: 'local', userId: user.id }, function(err, passport){
        if (err) return done(err);
        if(!passport) return done(null, false);
        bcrypt.compare(password, passport.password, function(err, res){
          if(err) return done(err);
          if(!res) return done(null, false);
          done(null, user);
        });
      });
      // if (!user.validPassword(password)) return done(null, false, { message: 'Incorrect password.' });
    });
  });
}
