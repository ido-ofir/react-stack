module.exports = function(collection){
  collection.route('/')
    .get(function(req, res) {                                             // GET '/myCollection?name=koko'  - get items by query string
      collection.find(req.query, res.flat, res.fail, req.user);
    })
    .post(function(req, res) {                                            // POST { name: 'koko'} => '/myCollection'   - create item
      collection.create(req.body, res.flat, res.fail, req.user);
    });

  collection.route('/:id')
    .get(function(req, res) {                                             // GET '/myCollection/55'  - get item by id
      collection.find({
        id: req.params.id
      }, res.flat, res.fail, req.user);
    })
    .put(function(req, res) {                                             // PUT { expired: true } => '/myCollection/55'  - update item by id
      delete req.body.id;
      collection.update({
        id: req.params.id
      }, req.body, res.flat, res.fail, req.user);
    })
    .delete(function(req, res) {                                           // DELETE '/myCollection/55'  - delete item by id
      collection.delete({
        id: req.params.id
      }, res.flat, res.fail, req.user);
    });
}
