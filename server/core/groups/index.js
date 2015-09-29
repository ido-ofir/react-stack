
var utils = require('../utils');

module.exports = function(api){
  var groups = utils.Cache('userGroup', api);
  return groups;
}
