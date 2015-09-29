module.exports = {
  toUser: function(action){
    var Chat = this.api.routes.chat;
    var socketServer = this.socketServer;
    var data = action.data;
    if(!data.userId) return action.fail('no userId field');
    if(data.userId === action.user.id) return action.fail('you cant send a chat message to yourself');
    if(!data.content) return action.fail('no content field');
    var chat = {
      from: action.user.id,
      to: data.userId,
      type: data.type || 'text',
      content: data.content
    };
    Chat.create(chat, function(dbChat){
      socketServer.toUser(data.userId, {
          type: 'chat',
          data: chat
      });
      action.done(dbChat);
    }, action.fail, action.user);
  },
  getChatWith(action){
    var Chat = this.api.routes.chat;
    var userId = action.data.userId;
    var user = action.user;
    if(!userId) return action.fail('userId field is missing');
    Chat.find({from: [user.id, userId], to: [user.id, userId]}, action.done, action.fail, user);
  }
};
