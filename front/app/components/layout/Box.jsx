

var Box = React.createClass({
  render(){
    var height = this.props.height;
    var width = this.props.width;
    var bottom = this.props.bottom;
    var right = this.props.right;
    var style = {
        position: 'absolute',
        top: this.props.top || 0,
        left: this.props.left || 0,
        right: right || 0,
        bottom: bottom || 0,
    };
    if(height || (height === 0)){
      if(bottom || (bottom === 0)) delete style.top;
      else delete style.bottom;
      style.height = height;
    }
    if(width || (width === 0)){
      if(right || (right === 0)) delete style.left;
      else delete style.right;
      style.width = width;
    }
    if(this.props.padding){
      style.padding = this.props.padding
    }
    return (
      <div style={ style } { ...this.props }>
        { this.props.children }
      </div>
    );
  }
});

module.exports = Box;
