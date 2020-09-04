import { readFile, unwatchFiles, watchFile } from '@jsxcad/sys';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Mermaid from 'mermaid';
import Pane from './Pane.js';
import PropTypes from 'prop-types';
import React from 'react';
import Row from 'react-bootstrap/Row';
import { toDomElement } from '@jsxcad/ui-notebook';

export class NotebookUi extends Pane {
  static get propTypes() {
    return {
      id: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);
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

  renderToolbar() {
    return super.renderToolbar();
  }

  renderPane() {
    const { id } = this.props;
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

    return (
      <Container
        key={id}
        style={{ height: '100%', display: 'flex', flexFlow: 'column' }}
      >
        <Row style={{ width: '100%', height: '100%', flex: '1 1 auto' }}>
          <Col style={{ width: '100%', height: '100%', overflow: 'auto' }}>
            {notebook}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default NotebookUi;
