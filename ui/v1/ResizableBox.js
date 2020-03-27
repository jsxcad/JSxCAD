import PropTypes from 'prop-types';
import React from 'react';
import Resizable from './Resizable';

// An example use of Resizable.
export default class ResizableBox extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    height: PropTypes.number,
    width: PropTypes.number,
    onResize: PropTypes.func,
    onResizeStart: PropTypes.func,
    onResizeStop: PropTypes.func,
    handle: PropTypes.object,
    handleSize: PropTypes.array,
    draggableOpts: PropTypes.object,
    minConstraints: PropTypes.arrayOf(PropTypes.number),
    maxConstraints: PropTypes.arrayOf(PropTypes.number),
    lockAspectRatio: PropTypes.bool,
    axis: PropTypes.oneOf(['both', 'x', 'y', 'none']),
    resizeHandles: PropTypes.arrayOf(PropTypes.oneOf(['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']))
  };

  static defaultProps = {
    handleSize: [20, 20]
  };

  state = {
    width: this.props.width,
    height: this.props.height,
    propsWidth: this.props.width,
    propsHeight: this.props.height
  };

  static getDerivedStateFromProps (props, state) {
    // If parent changes height/width, set that in our state.
    if (state.propsWidth !== props.width || state.propsHeight !== props.height) {
      return {
        width: props.width,
        height: props.height,
        propsWidth: props.width,
        propsHeight: props.height
      };
    }
    return null;
  }

  onResize = (e, data) => {
    const { size } = data;

    if (this.props.onResize) {
      e.persist && e.persist();
      this.setState(size, () => this.props.onResize && this.props.onResize(e, data));
    } else {
      this.setState(size);
    }
  };

  render () {
    // Basic wrapper around a Resizable instance.
    // If you use Resizable directly, you are responsible for updating the child component
    // with a new width and height.
    const { style = {}, handle, handleSize, onResize, onResizeStart, onResizeStop, draggableOpts, minConstraints,
            maxConstraints, lockAspectRatio, axis, width, height, resizeHandles, ...props } = this.props;
    return (
      <Resizable
        handle={handle}
        handleSize={handleSize}
        width={this.state.width}
        height={this.state.height}
        onResizeStart={onResizeStart}
        onResize={this.onResize}
        onResizeStop={onResizeStop}
        draggableOpts={draggableOpts}
        minConstraints={minConstraints}
        maxConstraints={maxConstraints}
        lockAspectRatio={lockAspectRatio}
        axis={axis}
        resizeHandles={resizeHandles}
      >
        <div style={{ ...style, width: this.state.width + 'px', height: this.state.height + 'px' }} {...props} />
      </Resizable>
    );
  }
}
