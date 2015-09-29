
var express = require('express');
var path = require('path');
var config = require('./config.js');
var schemas = require('./schemas');
var Core = require('./core');
var actions = require('./actions');

Core(config, schemas, function(core){
    var Action = core.actions.Action;
    Action('action', actions);
    Action('me', function(action){
      action.done(action.user);
    });
    core.app.use('/', express.static(path.join(process.cwd(), '../front')))
});
