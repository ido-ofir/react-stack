var leftStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0
};

var Left = React.createClass({
  render(){
    return (
      <div style={ leftStyle }>
        { this.props.children }
      </div>
    );
  }
});

module.exports = Left;
