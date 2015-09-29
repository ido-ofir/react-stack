
function noSuccess(data){
  console.log('socket success:');
  console.dir(data);
}
function noFail(err){
  console.log('socket fail:');
  console.dir(err);
}

module.exports = function(socket){
    return function(path, data, success, fail){
        if(typeof path === 'string') path = path.split('/');
        if(path.length === 1) path = path[0].split('.');
        socket.request('action', {
          path: path,
          data: data
        }, function(response){
          if (response.success === true) {
            if(success) success(response.data)
            else noSuccess(response.data);
          }
          else{
            if(fail) fail(response.message)
            else noFail(response.message);
          }
        });
    };
};
