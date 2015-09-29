
function Api(socket){
  function ApiRequest(route, action){
    return {
      route: route,
      action: action
    }
  }
  return {
    create(collection, data, success, fail){
      var apiReq = ApiRequest(collection, 'create', data);
      apiReq.args = [data];
      socket.action('api', apiReq, success, fail);
    },
    find(collection, data, success, fail){
      var apiReq = ApiRequest(collection, 'find', data);
      apiReq.args = [data];
      socket.action('api', apiReq, success, fail);
    },
    update(collection, target, update, success, fail){    // note that update has five arguments instead of four. 'target' selects which items will get updated and 'update' is the update data.
      var apiReq = ApiRequest(collection, 'update');
      apiReq.args = [target, update];
      socket.action('api', apiReq, success, fail);
    },
    delete(collection, data, success, fail){
      var apiReq = ApiRequest(collection, 'delete', data);
      apiReq.args = [data];
      socket.action('api', apiReq, success, fail);
    }
  };
}

module.exports = Api;
