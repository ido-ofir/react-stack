
var cookie = require('cookie');
var signature = require('cookie-signature');

module.exports = function(options){
  return {
    unsign: function(cookies){
      cookies = cookie.parse(cookies);
      if(!cookies) return false;
      var connectSid = cookies['connect.sid'];
      if(!connectSid) return false;
      return signature.unsign(connectSid.slice(2), options.secret) || undefined;
    }
  };
};
