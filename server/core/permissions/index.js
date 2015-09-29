
var utils = require('../utils');

 module.exports = function(api){
   var permissions = utils.Cache('userPermission', api);
   return permissions;
 }
