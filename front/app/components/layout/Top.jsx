var topStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
};

var top = React.createClass({
  render(){
    return (
      <div style={ topStyle }>
        { this.props.children }
      </div>
    );
  }
});

module.exports = top;
