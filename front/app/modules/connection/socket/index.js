
/*

  socket module initializes and returns a socket that attempts to connect to 'url'.
  it adds a 'socket.json(obj)' method to send json.
  it also adds a 'socket.request(method, data, callback)' which will execute 'method' on the server and return the result to 'callback'.

  whenever the socket recieves a message with a 'type' property -  it will emit an event with that type.
  for example if the socket recieves {type: 'koko', ... } - it will emit an event called 'koko'.

*/


var Socket = require('engine.io-client');
var Api = require('./api.js');
var utils = require('../utils.js');
var Request = require('./request.js');
var Action = require('./action.js');

module.exports = function(url, onMessage){
  var opened = false;
  var socket = new Socket(url);
  socket.on('open', function(){
    opened = true;
    socket.json = function(obj){   // send obj as json.
      var str = utils.stringify(obj);
      if(str) socket.send(str);
    };
    socket.exec = function(type, data){
      if(!opened) return console.error('cannot access server, socket is closed');
      var msg = {
        type: type,
        data: data
      };
      console.log('sending:');
      console.dir(msg);
      socket.json(msg);
    };
    socket.request = Request(socket);   // sends type 'request', listens for type 'response'
    socket.action = Action(socket);
    socket.api = Api(socket);   //   { create(), find(), ... }
    socket.on('close', function(){
      opened = false;
      console.log('socket closed');
    });
    if(onMessage) socket.on('message', onMessage);
  });
  return socket;
}
