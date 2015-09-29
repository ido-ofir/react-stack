

module.exports = function(wares) {
  wares = wares ? (Array.isArray(wares) ? wares : [].slice.call(arguments)) : [];
  var middleware = function(req, res, next) {
    var i = 0;
    var args = [].slice.call(arguments);
    var next = args.pop();
    if(!wares.length) return next();
    function run() {
      i++;
      wares[i - 1].apply(null, args.concat(wares[i] ? [run] : [next]));
    }
    run();
  };
  middleware.use = function(ware) {
    wares.push(ware);
    return middleware;
  };
  return middleware;
};
