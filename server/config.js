
// Require any waterline compatible adapters here
var diskAdapter = require('sails-disk');

var config = {
  domain: 'http://localhost',
  port: 4000,
  allowOrigin: ['http://localhost:3000'],
  authorize: true,  //
  authentication: {
    secret: 'kokoloko',
    adapter: diskAdapter,    // adapter for session authentication
    autoRemoveInterval: 6 * 60  // expired sessions will be cleaned every 6h
  },
  orm: {
    adapters: {
      'default': diskAdapter,
      disk: diskAdapter
    },
    connections: {
      localDisk: {
        adapter: 'disk'
      }
    },
    defaults: {
      migrate: 'alter'
    }
  },
  permissions: {
    root: {
      exclude: []
    }
  }
};

module.exports = config;
