
var Connection = require('./modules/connection');
var config = {
  domain: 'http://localhost',
  port: 4000,
  transport: 'websocket',
  api: {
    path: '/api'
  }
};
var connection = window.connection = Connection(config);
// connection.on('authorize', function(){
//   console.log('auto');
//   connection.action('me', {})
//   connection.on('chat', function(data){
//     console.log('chat:');
//     console.dir(data);
//   })
// });
connection.test(function(){
  connection.connect(function(data){
    console.log('data:');
    console.dir(data);
  });
}, function(){
  console.log('not connected');
});
var App = require('./App');
React.render(<App/>, document.getElementById('app'));
