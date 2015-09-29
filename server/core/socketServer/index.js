
/*

  socketServer module.

    generally an incoming socket message is expected to be in json format and have the following structure:

    {
      "type": "request",          //  indicates that a response needs to be sent back.
      "method": "myMethod",       //  a namespace for different behaviours of the server. this will determine how this message will be handled.
      "id": "13",                 //  a client side id of the request, will be echoed back with the response so the client can match the response to the request
      "data": [{name: 'koko'}],   //  relevent data form the client
    }

    for each valid request the server will emit a `method:[methodName]` event.
    for example  if 'method' is 'myMethod' - a 'method:myMethod' event will be fired from the server.
    for clarity of code the server exposes an onMethod(methodName, listener) function.
    to listen for a specific method call from clients you can call this method:

    socketServer.onMethod('myMethod', function callback(socket, data, success, fail){
      console.log(socket.user.id); // socket.user is the user making the request
      console.log(data);          // whatever the client passed in.
    })

    generally a valid socket message will execute the matching method on the server and return a successful or failed response:
    {
      success: true / false,        // did it work?
      id: "13",                     // original id of the request.
      data: { cool: "stuff" }       // if success is true this will the data returned by the server.
      error: "something bad happend"    // if success is false this will the error returned by the server.
    }

*/


var http = require('http');
var engine = require('engine.io');
var Socket = require('./socket.js');
var Action = require('./action.js');

module.exports = function(app, options){
  var httpServer = http.createServer(app);
  var server = engine.attach(httpServer);
  var sockets = server.sockets = [];

  server.authorize = function(socket){
    socket = Socket(socket);  // socket will now emit 'request' events when a valid request arrives.
    sockets.push(socket);
    socket.on('action', function(data){
      var action = Action(socket, data);
      server.emit('action', action);
    });
    socket.on('close', function(){
      sockets.splice(sockets.indexOf(socket), 1);
    });
    server.emit('authorize', socket);
  };
  server.broadcast = function(any){
    sockets.map(function(socket){
      socket.json(any);
    });
  };
  server.toUser = function(id, any){
    sockets.map(function(socket){
      if(socket.user.id === id) socket.json(any);
    });
  };

  server.updateUser = function(user){
    var permissions;
    for (var i = 0; i < sockets.length; i++) {
      if(sockets[i].user.id === user.id){
        user.permissions = sockets[i].user.permissions;
        sockets[i].user = user;
        return;
      }
    }
  };
  server.updateUserPermissions = function(userId, permissions){
    for (var i = 0; i < sockets.length; i++) {
      if(sockets[i].user.id === userId){
        sockets[i].user.permissions = permissions;
        return;
      }
    }
  };

  server.disconnectOrigin = function(origin){
    sockets.forEach(function(socket){
      if(socket.request.headers.origin === origin){
        console.log('closing socket');
        socket.close();
      }
    })
  }

  server.listen = httpServer.listen.bind(httpServer);
  return server;
};
