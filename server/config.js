// Require any waterline compatible adapters here
var diskAdapter = require('sails-disk');
    // mysqlAdapter = require('sails-mysql');


// Build A Config Object
var config = {
  authenticate: false,
  orm: {
    adapters: {
      'default': diskAdapter,
      disk: diskAdapter
    },
    connections: {
      localDisk: {
        adapter: 'disk'
      }
      //
      // myLocalMySql: {
      //   adapter: 'mysql',
      //   host: 'localhost',
      //   database: 'foobar'
      // }
    },
    defaults: {
      migrate: 'alter'
    }
  }
};

module.exports = config;
