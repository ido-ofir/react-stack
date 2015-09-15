
var Route = require('./Route.js');
var express = require('express');
var Emitter = require('./Emitter');
var Waterline = require('waterline');

module.exports = function(schemas, config, callback){
    var api = Emitter();
    var orm = api.orm = new Waterline();
    var router = api.router = express.Router();

    api.config = config;
    api.schemas = schemas;
    api.routes = {};
    api.models = {};

    loadSchemas(schemas, orm);

    orm.initialize(config.orm, function(err, models) {
      if(err) throw err;
      api.models = models.collections;
      api.connections = models.connections;
      for(var name in schemas){
          api.routes[name] = Route(name, router, api.models[name], api);
      }
      // Start Server
      callback(api);
    });
    return api;
};

function loadSchemas(schemas, orm){
  var schema;
  for(var name in schemas){
      schema = schemas[name];
      schema.identity = schema.identity || name;
      schema.connection = schema.connection || 'localDisk';
      orm.loadCollection(Waterline.Collection.extend(schema));
  }
}
