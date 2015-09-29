
function Success(id, data){
  return {
    type: 'response',
    response: {
      success: true,
      data: data
    },
    id: id
  };
}

function Fail(id, key, value){
  var response = { success: false };
  response[key] = value;
  return {
    type: 'response',
    response: response,
    id: id
  };
}


module.exports = function(socket, request){
  var id = request.id;
  if(!id) return console.error('cannot send a socket response');
  return {
      path: request.path,
      data: request.data,
      user: socket.user,
      error: function(error){
        var fail = Fail(id, 'error', error);
        socket.json(fail);
      },
      fail: function(message){
        var fail = Fail(id, 'message', message);
        socket.json(fail);
      },
      reject: function(reject){
        var fail = Fail(id, 'reject', reject);
        socket.json(fail);
      },
      done: function(data){
        var success = Success(id, data);
        socket.json(success);
      }
  }
}
