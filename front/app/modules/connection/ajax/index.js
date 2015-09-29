var Request = require('./request.js');
var Api = require('./api.js');

module.exports = function(config){
  var request = Request(config);
  request.login = function(loginData, success, fail) {
    request.post(`/login`, loginData, success, fail);
  };
  request.register = function(regData, success, fail) {
    request.post(`/register`, regData, success, fail);
  };
  request.logout = function(success, fail) {
    request.post(`/logout`, {}, success, fail);
  };
  request.action = function(path, data, success, fail) {
    request.post('/' + path.join('/'), data, success, fail);
  };
  request.api = Api(config.api.path, request);
  return request;
}
