var updating = false;
var callbacks = [];


module.exports = {
    batch: function batch(cb) {
        callbacks.push(cb);
        if(updating) return;
        updating = true;
        setTimeout(()=>{
            var cbs = callbacks.filter((cb, i) => {
                return callbacks.indexOf(cb) === i;
            });
            callbacks = [];
            updating = false;
            cbs.map(cb => cb());
        }, 0);
    },
    stopEvent: function stopEvent (event) {
        event.preventDefault();
        event.stopPropagation();
    }
};