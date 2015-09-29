var Waterline = require('waterline');

module.exports = function(schemas, config, callback){
  var orm = new Waterline();
  for(var name in schemas){
      schema = schemas[name];
      schema.identity = (schema.identity || name).toLowerCase();
      schema.connection = schema.connection || 'localDisk';
      orm.loadCollection(Waterline.Collection.extend(schema));
  }
  orm.initialize(config, function(err, models) {
    if(err) throw err;
    callback(orm);
  });
}
