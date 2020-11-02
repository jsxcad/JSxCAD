import Mermaid from 'mermaid';
import PropTypes from 'prop-types';
import React from 'react';
import { toDomElement } from '@jsxcad/ui-notebook';

export class NoteUi extends React.PureComponent {
  static get propTypes() {
    return {
      hash: PropTypes.string,
      data: PropTypes.array,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data, hash } = this.props;
    let ref;
    const result = (
      <div
        ref={(value) => {
          ref = value;
        }}
      />
    );
    setTimeout(async () => {
      if (ref) {
        while (ref.firstChild) {
          ref.removeChild(ref.lastChild);
        }
        for (const note of data) {
          if (note && note.hash === hash) {
            const element = await toDomElement([note]);
            if (note.view && note.view.inline) {
              ref.style.width = `${note.view.inline}%`;
              ref.style.display = 'inline-block';
            }
            ref.appendChild(element);
          }
        }
      }
    }, 0);
    return result;
  }
}

export class NotebookUi extends React.PureComponent {
  static get propTypes() {
    return {
      id: PropTypes.string,
      data: PropTypes.array,
      path: PropTypes.string,
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
    const { data, path } = this.props;
    let ref;
    const result = (
      <div
        onKeyDown={this.onKeyDown}
        ref={(value) => {
          ref = value;
        }}
        style={{ height: '100%', overflow: 'scroll', marginLeft: '20px' }}
      >
        {data &&
          data
            .filter((note) => note.hash)
            .map((note) => {
              // FIX: Rename or differentiate 'text' and 'error'.
              if (note.module === path || note.text) {
                return <NoteUi data={data} key={note.hash} hash={note.hash} />;
              }
            })}
      </div>
    );
    setTimeout(async () => {
      if (ref) {
        Mermaid.init(undefined, '.mermaid');
      }
    }, 100);
    return result;
  }
}

export default NotebookUi;
