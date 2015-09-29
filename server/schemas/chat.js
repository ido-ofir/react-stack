var chat = {
  schema: true,
  attributes: {
    from: { type: 'string' },
    to: { type: 'string' },
    groupId: { type: 'string' },
    type: { type: 'string' },
    content: { type: 'string' }
  }
};

module.exports = chat;
