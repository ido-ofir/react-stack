

var express = require('express');

var Orm = require('./orm');
var Bootstrap = require('./bootstrap');
var Authentication = require('./authentication');
var Api = require('./api');
var SocketServer = require('./socketServer');
var Actions = require('./actions');
var Permissions = require('./permissions');
var Groups = require('./groups');

var utils = require('./utils');

module.exports = function(config, schemas, callback){
  Orm(schemas, config.orm, function(orm){
    var core = { orm: orm, utils: utils };
    var bootstrap = Bootstrap(config);
    var app = core.app = express();
    var api = core.api = Api(schemas, orm, config);
    var auth = core.auth = Authentication(api, permissions, config.authentication);
    var socketServer = core.socketServer = SocketServer(app);
    var permissions = core.premissions = Permissions(api);    // user permissions are handled in-memory by the permissions module.
    var groups = core.groups = Groups(api);    // user permissions are handled in-memory by the permissions module.
    var actions = core.actions = Actions(core);

    app.use(bootstrap);  // normal express bootstrap. TODO: bootsrap based on config

    app.use(auth.session);  // restore session data, if exists, as req.user

    app.get('/test', function(req, res, next){
      if(req.user) res.success(true);
      else res.fail(false);
    });
    app.post('/login', auth.login);
    app.post('/logout', auth.logout);
    app.post('/register', auth.register);

    actions.Action('api', function(action){
      api.request(action.data, action.done, action.fail, action.user);
    });
    app.use('/rest', function(req, res, next){
      if(config.authorize) auth.lock(req, res, next);    // a user must be logged in to access the api.
      else next();
    }, api.router);

    auth.afterRegister(function(req, res, done){   // after a user has succesfully registered, req.user is the user.
        console.log('registered', req.user.name);
        api.routes.userPermission.create({
          userId: req.user.id,
          permissions: ['basic']
        }, function(userPermission){  // create a new, basic permission for the user.
          auth.login(req, res, done);
        }, res.fail, req.user);
    });
    auth.afterLogin(function(req, res, done){
        console.log('logged in', req.user.name);
        done();
    });
    auth.beforeLogout(function(req, res, done){
        console.log('logging out', req.user.name);
        socketServer.disconnectOrigin(req.headers.origin);  // disconnect client socket on logout.
        done();
    });
    auth.afterDeserializeUser(function(user, done){     // this runs for every valid request, after a user has been succefully deserialized from the database,
      // console.log('deserialized', user.name);        // but before it was marked as authenticated. you can add stuff to user if you like.
      done();
    });



    api.routes.user.after('delete', function(event, done){   // when users are deleted, delete their passports and permissions too.
      if(!event.data.length) return next();
      utils.forEach(event.data, function(deletedUser, index, next){  // async forEach
        auth.clearUserPassport(deletedUser.id, function(){
          api.routes.userPermission.delete({
            userId: deletedUser.id
          }, next, function(err){
            console.error(err);
            next();
          }, event.user);
        });
      }, done);
    });
    api.after(['create', 'update', 'delete'], function(event, done){
      console.log(event.user.name + ' has ' + event.action + 'd a ' + event.name);
      done();
    });

    socketServer.on('connection', function (socket) {           // fired for every incoming socket connection.
      auth.authenticateSocket(socket, function(){               // authenticate the socket request. a socket request must be from a logged in user to connect to the socket server.
        console.log('socket connected - ' + socket.user.name);  // if authentication passed, this function is called and socket.user is the already logged in user.
        socketServer.authorize(socket);
      }, function(err){
        console.log('a socket has failed authentication:', err);     // if authentication failed, close the socket.
        socket.close()
      });
    });
    socketServer.on('authorize', function(socket){              // this socket has passed authentication and socket.user is the user of the socket.
      socket.json({                       // this is the first message an authenticated socket will recieve.
        type: 'authorize',
        data: socket.user
      });
    });

    permissions.load(function(){                    // load and cache users permissions from the database
      groups.load(function(){
        socketServer.listen(config.port, function(){         // start the server
            console.log("listening at " + config.domain + ":" + config.port);
            callback(core);
        });
      })
    });
  });
}
