/* global mermaid */
import * as PropTypes from 'prop-types';

import Col from 'react-bootstrap/Col';
import React from 'react';

import { animationFrame } from './schedule.js';

export class JsViewerUi extends React.PureComponent {
  static get propTypes() {
    return {
      path: PropTypes.string,
      data: PropTypes.string,
      advice: PropTypes.object,
      onChange: PropTypes.func,
      onClose: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { advice } = this.props;
    if (!advice) {
      return;
    }
    const { notebookDefinitions } = advice;

    let updating = false;
    const update = async () => {
      try {
        if (updating) {
          return;
        }
        const container = this.view;
        if (!container) {
          return;
        }
        updating = true;
        await animationFrame();
        if (advice && advice.definitions) {
          const orderedNotes = [];
          for (const definition of Object.keys(notebookDefinitions)) {
            const { domElements, notes } = notebookDefinitions[definition];
            const { initSourceLocation } = advice.definitions.get(definition);
            const line = initSourceLocation.start.line;
            orderedNotes.push({ domElements, notes, line });
          }
          orderedNotes.sort((a, b) => a.line - b.line);
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
          for (const { domElements } of orderedNotes) {
            for (const domElement of domElements) {
              domElement.style.visibility = '';
              domElement.style.position = '';
              container.appendChild(domElement);
            }
          }
          mermaid.init(undefined, '.mermaid');
        }
      } finally {
        updating = false;
      }
    };

    const finished = () => {};

    advice.onUpdate = update;
    advice.onFinished = finished;

    update();
  }

  async update() {}

  async componentWillUnmount() {
    const { onClose, advice = {} } = this.props;
    const { notebookNotes } = advice;
    if (notebookNotes) {
      notebookNotes.onUpdate = undefined;
      notebookNotes.onFinished = undefined;
    }
    if (onClose) {
      await onClose();
    }
  }

  render() {
    return (
      <Col
        style={{ height: '100%', width: '100%' }}
        onKeyDown={this.onKeyDown}
        ref={(ref) => {
          this.view = ref;
        }}
      ></Col>
    );
  }
}

export default JsViewerUi;
