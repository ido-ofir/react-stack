module.exports = function(socket){
  return function(type, data){
    var msg = {
      type: type,
      data: data
    };
    socket.json(msg);
  }
}
