
/*

   api Route module.
   builds a rest api for provided schemas, which can be accessed by /api/[name].
   the module also produces an object for server side access which has the following methods:

      create (item, success, fail) {}
      update (item, success, fail) {} // item must have a valid id or _id
      find (object, success, fail) {}
      delete (id, success, fail) {}

      the route object will emit events both on the api and on the route itself for every action that it does.
       this route object will also have a 'model' field which is the waterline model.


* */

var Waterline = require('waterline');
var Emitter = require('./Emitter');

function Action(event, next, fail){
  return function(err, data){
      if(err) return fail(err);
      event.data = data;
      next();
  }
}

function Fail(res){
  return function(err){
    res.json({
      success: false,
      error: err
    });
  };
}

function Success(res){
  return function(data){
    res.json(data);
  };
}




module.exports = function(name, router, model, api){
    //console.log('defining route ', name);
    var route = Emitter(),
        authenticate = (api.config.authenticate === true);

    route.model = model;

    function emit(target, eventName, event, next, fail) {
        var listened = target.emit(eventName, event, next, fail);
        if(!listened) next();
    }


    function run(eventName, data, action, success, fail, user) {          // emits 'before' events, then performs the action, then emits 'after' events, then calls 'success'
        if(authenticate && !user) {
            //console.log(eventName, name, 'cannot find user');
            return fail('cannot find user in ' + name + '.' + eventName);
        }
                                                                         // all the listeners and db calls are called with the same event object. mutate event.data to control what the next listener will get
        var before = 'before.' + eventName;
        var after = 'after.' + eventName;
        var event = {   // the emitted event. event.data is whatever the user passed in
          data: data,
          model: model,
          name: name,
          user: user,
          action: eventName
        };
        var uuid = data.uuid;                                            // example - if event is 'create':
        emit(api, before, event, function(){                             // emit 'before.create' on api
            emit(route, before, event, function(){                       // emit 'before.create' on route
                action(event, function(){                                // perform route's create action
                    if(uuid) event.data.uuid = uuid;                     // copy uuid for tracking optimistic updates in the client
                    emit(route, after, event, function(){                // emit 'after.create' on route
                        emit(api, after, event, function(){              // emit 'after.create' on api
                            success(event.data);                         // successfully finished. event.data is now the result of all listeners and the db call.
                        }, fail);
                    }, fail);
                });
            }, fail);
        }, fail);
    }

    route.create = function(item, success, fail, user){
        if(!item) item = {};
        run('create', item, function(event, next){
            model.create(event.data, Action(event, next, fail));
        }, success, fail, user);
    };

    route.update = function(target, item, success, fail, user){
        run('update', item, function(event, next){
            delete event.data.id;   // dont pass id to update
            model.update(target, event.data, Action(event, next, fail));
        }, success, fail, user);
    };

    route.find = function(target, success, fail, user){
        run('find', target, function(event, next){
            model.find(event.data).exec(Action(event, next, fail));
        }, success, fail, user);
    };

    route.delete = function(target, success, fail, user){
        run('delete', target, function(event, next){
            model.destroy(event.data, Action(event, next, fail));
        }, success, fail, user);
    };

    router.route('/' + name)
      .get(function(req, res){
          route.find(req.query, Success(res), Fail(res), req.user);
      })
      .post(function(req, res){
          route.create(req.body, Success(res), Fail(res), req.user);
      })
      .delete(function(req, res){
          route.create(req.body, Success(res), Fail(res), req.user);
      });

    router.route('/' + name + '/:id')
      .get(function(req, res){
          route.find({id: req.params.id}, Success(res), Fail(res), req.user);
      })
      .put(function(req, res){
          delete req.body.id;
          route.update({id: req.params.id}, req.body, Success(res), Fail(res), req.user);
      })
      .delete(function(req, res){
          route.delete({id: req.params.id}, Success(res), Fail(res), req.user);
      });

    route.route = function(url){
        return router.route('/' + name + url);
    };

    return route;
};
