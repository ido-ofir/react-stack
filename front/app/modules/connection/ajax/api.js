module.exports = function(apiPath, request){

  function ApiRequest(route, action, args){
    return {
      route: route,
      action: action,
      args: args
    };
  }

  return {
    create(collection, data, success, fail){
      var apiRequest = ApiRequest(collection, 'create', [data]);
      request.post(apiPath, apiRequest, success, fail);
    },
    find(collection, data, success, fail){
      var apiRequest = ApiRequest(collection, 'find', [data]);
      request.post(apiPath, apiRequest, success, fail);
    },
    update(collection, target, update, success, fail){    // note that update has five arguments instead of four. 'target' selects which items will get updated and 'update' is the update data.
      var apiRequest = ApiRequest(collection, 'update', [target, update]);
      request.post(apiPath, apiRequest, success, fail);
    },
    delete(collection, data, success, fail){
      var apiRequest = ApiRequest(collection, 'delete', [data]);
      request.post(apiPath, apiRequest, success, fail);
    }
  };
};
