

var Bottom = React.createClass({
  render(){
    var bottomStyle = {
        position: 'absolute',
        left: this.props.left || 0,
        right: 0,
        bottom: 0
    };
    return (
      <div style={ bottomStyle }>
        { this.props.children }
      </div>
    );
  }
});

module.exports = Bottom;
