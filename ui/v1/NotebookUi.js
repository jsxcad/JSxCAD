import { readFile, unwatchFiles, watchFile } from '@jsxcad/sys';

import Mermaid from 'mermaid';
import PropTypes from 'prop-types';
import React from 'react';
import { toDomElement } from '@jsxcad/ui-notebook';

export class NotebookUi extends React.PureComponent {
  static get propTypes() {
    return {
      id: PropTypes.string,
      file: PropTypes.file,
      onRun: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.onKeyDown = this.onKeyDown.bind(this);
    this.update = this.update.bind(this);
  }

  async componentDidMount() {
    const { file } = this.props;
    const watcher = await watchFile(`notebook/${file}`, this.update);
    this.setState({ watcher, refs: [] });
    await this.update();
  }

  async componentWillUnmount() {
    const { watcher } = this.state;

    if (watcher) {
      await unwatchFiles(watcher);
    }
  }

  async update() {
    const { file } = this.props;
    const { refs } = this.state;
    const notebook = await readFile({}, `notebook/${file}`);
    const newDomElement = await toDomElement(notebook);
    if (refs[0]) {
      refs[0].removeChild(refs[0].firstChild);
      refs[0].appendChild(newDomElement);
    }
    this.setState({ notebook, domElement: newDomElement });
    Mermaid.init(undefined, '.mermaid');
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
    const { domElement, refs } = this.state;

    const notebook = domElement ? (
      <div
        ref={(ref) => {
          if (ref) {
            refs[0] = ref;
            ref.appendChild(domElement);
          }
        }}
      ></div>
    ) : (
      <div />
    );

    return <div onKeyDown={this.onKeyDown}>{notebook}</div>;
  }
}

export default NotebookUi;
