
function AjaxAction(req, res){
  return {
    done: res.success,
    fail: res.fail,
    reject: res.reject,
    error: res.error,
    user: req.user,
    data: req.body
  };
}

module.exports = function(core){

  var actions = {};

  core.socketServer.on('action', function(action){   // sockets that send a { type: action } will route to the relevant action.
      var found = find(actions, action.path);
      if(found && (typeof found === 'function')){
        found(action);
      }
      else{
        action.fail('incorrect path - ' + action.path)
      }
  });

  function find(target, path){
    if(!target || !path) return;
    var name = path[0];
    if(path.length === 1) return target[name];
    return find(target[name], path.slice(1));
  }

  function Action(path, method){
    function call(action){
      method.call(core, action);
    }
    core.app.post('/' + path.join('/'), function(req, res, next){
      var ajaxAction = AjaxAction(req, res);
      call(ajaxAction);
    });
    return call;
  }

  function ActionOrObject(path, any){
    if(typeof any === 'function'){
      return Action(path, any);
    }
    else if(typeof any === 'object'){
      var result = {};
      for(var m in any){
        result[m] = ActionOrObject(path.concat([m]), any[m])
      }
      return result;
    }
  }

  return {
    Action: function(name, method, children){
      var action, child, childActions = {};
      if(typeof method === 'function'){
        action = Action([name], method);
        if(children){
          for(m in children){
            child = ActionOrObject([name, m], children[m]);
            if(child) childActions[m] = child;
          }
          action.children = childActions;
        }
      }
      else if(typeof method === 'object'){
        action = ActionOrObject([name], method);
      }
      else return console.error(`cannot create action for ${name}, method is of wrong type`);
      actions[name] = action;
    }
  };
}
