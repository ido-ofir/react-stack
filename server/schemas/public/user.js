var user = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    name  : { type: 'string' },
    //username  : { type: 'string', unique: true },
    // email     : { type: 'email',  unique: true },
    // passports : { collection: 'Passport', via: 'user' },
    // connections: { type: 'array' }   // all current connections of the user
  }
};

module.exports = user;
