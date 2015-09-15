var express = require('express');

var config = require('./config.js');
var schemas = require('./schemas');
var Api = require('./api');
var Server = require('./server.js');
var app = express();


Api(schemas.public, config, function(api){
  var server = Server(app);
  app.use('/api', api.router);
  server.httpServer.listen(4000, function(){
      console.log("To see saved users, visit http://localhost:4000/api/user");
  });
  api.routes.user.before('find', function(event, next){
    console.log('find!!');
    next();
  });
});







// app.get('/users', function(req, res) {
//   app.models.user.find().exec(function(err, models) {
//     if(err) return res.json({ err: err }, 500);
//     models.push('okkkkk');
//     res.json(models);
//   });
// });
