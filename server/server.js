
/*
*
*   express server boilerplate.
*   usage:
*
*       var Server = require('./server.js');
*       Server({
*           port: 80,
*           front: '/front',
*           favicon: '/front/favicon.ico'
*       }, function(server){
*           server.app;        // express app
*       })
*
* */

var path = require('path');
var http = require('http');
// var express = require('express');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
// var multer = require('multer');
// var errorHandler = require('errorhandler');
// var cors = require('cors');
// var passport = require('passport');
// var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);
// var LocalStrategy = require('passport-local').Strategy;
// var cookie = require('cookie');
// var signature = require('cookie-signature');
var Emitter = require('events').EventEmitter;


module.exports = function(app, options, callback){
    // if(!options) options = {};
    // if(!callback) callback = options;
    // if(options.authenticate){
    //     passport.use(new LocalStrategy(options.authenticate));
    // }
    // if(options.serializeUser){
    //     passport.serializeUser(options.serializeUser);
    //     passport.deserializeUser(options.deserializeUser);
    // }

    //
    // var front = path.join(process.cwd(), options.front || '');
    // var store = new MongoStore({ mongooseConnection: options.connection, ttl: 10000 });
    // var mongoSession = session({
    //     resave: true,
    //     saveUninitialized: true,
    //     secret: 'uwotm8',
    //     store: store
    // });
    // var app = options.app || express();
    // var fav = path.join(front, options.favicon || 'favicon.ico');
    // app.set('port', options.port || 8080);


    // if(fav) app.use(favicon(fav));
    //app.use(logger('dev'));
    app.use(methodOverride());
    // app.use(mongoSession);
    // app.use(passport.initialize());
    // app.use(passport.session());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    // app.use(multer());
    // app.use(cors());


    var httpServer = http.createServer(app);
    var server = new Emitter();

    // var io = require('socket.io')(httpServer);
    // io.on('connection', function (socket) {
    //     var cookies = cookie.parse(socket.handshake.headers.cookie);     // get the cookie that connect uses and use it to find the user.
    //     var connectSid = cookies['connect.sid'];                        // we do this to verify that the socket has passed passport's authentication.
    //     socket.sessionId = signature.unsign(connectSid.slice(2), 'uwotm8') || undefined;
    //     if(socket.sessionId){
    //         store.get(socket.sessionId, function(err, session) {
    //             if(err) return console.error(err);
    //             if(session && session.passport && session.passport.user){
    //                 options.deserializeUser(session.passport.user, function(err, user){
    //                     if(err) {
    //                         console.log('error:');
    //                         console.dir(err);
    //                     }
    //                     else{
    //                         socket.user = user;
    //                         server.emit('socket.authorized', socket);
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // });
    server.app = app;
    server.httpServer = httpServer;
    // server.passport = passport;
    // server.io = io;
    // server.session = mongoSession;
    // server.store = store;
    // server.broadcast = function(eventName, eventData){
    //     io.sockets.sockets.forEach(function(socket){
    //         socket.emit(eventName, eventData);
    //     });
    // };
    // server.broadcastToUser = function(userId, eventName, eventData){
    //     io.sockets.sockets.forEach(function(socket){
    //         if(socket.user){
    //             if(socket.user._id.toString() === userId){
    //                 //console.log('broadcasting to user');
    //                 socket.emit(eventName, eventData);
    //             }
    //         }
    //     });
    // };

    return server;
};
