
/*

   api Collection module.
   the module produces an object for server side access which has the following methods:

      create (item, success, fail) {}
      update (item, success, fail) {} // item must have a valid id or _id
      find (object, success, fail) {}
      delete (id, success, fail) {}

      the module will emit events both on the api and on the module itself for every action that it does.
      this module will also have a 'model' field which is the waterline model.

* */
var Emitter = require('./Emitter');

/*

function Action(event: Object, next: function, fail: function)

  creates a callback function for db operations.
  if successful event.data will be set and next() will be called.
  if the operation returned an error, fail(error) will be called instead.

*/


function Action(event, next, fail){
  return function(err, data){
      if(err) return fail(err);
      event.data = data;
      next();
  }
}




module.exports = function(name, router, model, api){
    //console.log('defining route ', name);
    var collection = Emitter();

    collection.model = model;
    collection.name = name;

    function emit(target, eventName, event, next, fail) {
        var listened = target.emit(eventName, event, next, fail);
        if(!listened) next();
    }


    function run(eventName, data, action, success, fail, user) {          // emits 'before' events, then performs the action, then emits 'after' events, then calls 'success'
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
            emit(collection, before, event, function(){                       // emit 'before.create' on route
                action(event, function(){                                // perform route's create action
                    if(uuid) event.data.uuid = uuid;                     // copy uuid for tracking optimistic updates in the client
                    emit(collection, after, event, function(){                // emit 'after.create' on route
                        emit(api, after, event, function(){              // emit 'after.create' on api
                            success(event.data);                         // successfully finished. event.data is now the result of all listeners and the db call.
                        }, fail);
                    }, fail);
                });
            }, fail);
        }, fail);
    }

    collection.create = function(item, success, fail, user){
        if(!item) item = {};
        run('create', item, function(event, next){
            model.create(event.data, Action(event, next, fail));
        }, success, fail, user);
    };

    collection.update = function(target, item, success, fail, user){
        run('update', item, function(event, next){
            delete event.data.id;   // dont pass id to update
            model.update(target, event.data, Action(event, next, fail));
        }, success, fail, user);
    };

    collection.find = function(target, success, fail, user){
        run('find', target, function(event, next){
            model.find(event.data, Action(event, next, fail));
        }, success, fail, user);
    };

    collection.delete = function(target, success, fail, user){
        run('delete', target, function(event, next){
            model.destroy(event.data, Action(event, next, fail));
        }, success, fail, user);
    };

    collection.route = function(url) {
      return router.route('/' + name + url);
    };

    return collection;
};
