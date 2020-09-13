import Mermaid from 'mermaid';
import PropTypes from 'prop-types';
import React from 'react';
import { toDomElement } from '@jsxcad/ui-notebook';

export class NotebookUi extends React.PureComponent {
  static get propTypes() {
    return {
      id: PropTypes.string,
      data: PropTypes.array,
      // file: PropTypes.string,
      onRun: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  stop(e) {
    e.stopPropagation();
  }

  preventDefault(e) {
    e.preventDefault();
    return false;
  }

  onKeyDown(e) {
    const ENTER = 13;
    const SHIFT = 16;
    const CONTROL = 17;

    const key = e.which || e.keyCode || 0;

    switch (key) {
      case CONTROL:
      case SHIFT:
        return true;
    }

    const { shiftKey } = e;
    switch (key) {
      case ENTER: {
        if (shiftKey) {
          const { onRun } = this.props;
          e.preventDefault();
          e.stopPropagation();
          if (onRun) {
            onRun();
          }
          return false;
        }
        break;
      }
    }
  }

  render() {
    const { data } = this.props;
    let ref;
    const result = (
      <div
        onKeyDown={this.onKeyDown}
        ref={(value) => {
          ref = value;
        }}
      />
    );
    setTimeout(async () => {
      while (ref.firstChild) {
        ref.removeChild(ref.lastChild);
      }
      ref.appendChild(await toDomElement(data));
      Mermaid.init(undefined, '.mermaid');
    }, 0);
    return result;
  }
}

export default NotebookUi;
