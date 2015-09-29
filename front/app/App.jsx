
var layout = require('./components/layout');
var Box = layout.Box;

module.exports = React.createClass({
    render () {
        return (
          <Box width="200px" right="0">
            <input/>
            <button>Send</button>
          </Box>
        );
    }
});
