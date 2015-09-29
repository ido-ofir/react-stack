
var Ajax = require('./ajax');
var Socket = require('./socket');
var Emitter = require('./Emitter.js');
var utils = require('./utils.js');

module.exports = function(config){
  var ajax = Ajax(config);
  var socket;

  var connection = Emitter({
    test: function(success, fail){
      ajax.get('/test', {}, success, fail);
    },
    connect(success, fail){
      var connected = false;
      socket = Socket(`${config.domain}:${config.port}`, function(message){
        var msg = utils.parse(message);
        if(msg || msg.type){
          if(msg.type === 'response') socket.response(msg);
          else if(msg.type === 'authorize') {
            connected = true;
            if(success) success(msg.data);
            else console.log(`connected to ${config.domain}:${config.port}`);
          }
          connection.emit(msg.type, msg);
        }
      });
      setTimeout(function(){
        if(!connected){
          if(fail) fail(`could not connect to ${config.domain}:${config.port}`);
          else console.error(`could not connect to ${config.domain}:${config.port}`);
        }
      },2000)
    },
    login: function(loginData, success, fail){
      ajax.login(loginData, function(res){
          connection.connect(success);
      }, fail);
    },
    register: function(regData, success, fail){
      ajax.register(regData, function(res){
        connection.connect(success);
      }, fail);
    },
    logout: function(success, fail){
      ajax.logout(success, fail);
    },
    api: {
      create(collection, data, success, fail){
        ajax.api.create(collection, data, success, fail);
      },
      find(collection, data, success, fail){
        if(config.transport === 'ajax') ajax.api.find(collection, data, success, fail);
        else socket.api.find(collection, data, success, fail);
      },
      update(collection, target, update, success, fail){
        ajax.api.update(collection, target, update, success, fail);
      },
      delete(collection, data, success, fail){
        ajax.api.delete(collection, data, success, fail);
      },
    },
    action(path, data, success, fail){
      if(!path) return fail('cannot request action, path parameter is not valid');
      if(typeof path === 'string'){
        path = path.split('/');
        if(path.length === 1){
          path = path[0].split('.');
        }
      }
      if(config.transport === 'ajax') ajax.action(path, data, success, fail);
      else socket.action(path, data, success, fail);
    }
  });
  return connection;
};
