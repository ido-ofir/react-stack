
var express = require('express');

var Emitter = require('./Emitter');
var Collection = require('./Collection.js');
var Rest = require('./Rest.js');
var utils = require('../utils');

module.exports = function(schemas, orm, config){
    var api = Emitter();
    var router = api.router = express.Router();
    var schema, model, collection;

    api.config = config;
    api.schemas = schemas;
    api.routes = {};
    api.models = orm.collections;

    for(var name in schemas){
      model = orm.collections[name.toLowerCase()];
      if(model) {
        collection = Collection(name, router, model, api);
        Rest(collection);   // legacy rest api
        api.routes[name] = collection;
      }
      else{
        console.error('cannot load model ' + name);
      }
    }

    api.request = function(data, success, fail, user){    // this is the where client connections the api.  data should be { route: 'user', action: 'find', args: [{name: 'koko'}]}
      var route = data.route,
          action = data.action,
          args = data.args,
          collection;
      if(!user) return fail('cannot find user');
      if(!route) return fail('cannot find route');
      if(!action) return fail('cannot find action');
      if(!args) return fail('cannot find args array');
      if(!Array.isArray(args)) return fail('args parameter must be an array. got ' + (typeof args));
      collection = api.routes[route];
      if(!collection) return fail(`invalid route ${route}`);
      if(!collection[action]) return fail(`invalid action ${action}`);
      args.push(success);
      args.push(fail);
      args.push(user);
      collection[action].apply(collection, args);
    };
    return api;
};
