/* global Blob */

import {
  readFile,
  unwatchFiles,
  watchFile
} from '@jsxcad/sys';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Pane from './Pane';
import PropTypes from 'prop-types';
import React from 'react';
import Row from 'react-bootstrap/Row';
import { orbitDisplay } from '@jsxcad/ui-threejs';
import saveAs from 'file-saver';

const downloadFile = async (path) => {
  const data = await readFile({ as: 'bytes' }, path);
  const blob = new Blob([data.buffer], { type: 'application/octet-stream' });
  saveAs(blob, path.split('/').pop());
};

export class ViewUi extends Pane {
  static get propTypes () {
    return {
      file: PropTypes.string,
      id: PropTypes.string
    };
  }

  constructor (props) {
    super(props);

    this.state = {
      file: props.file,
      containerId: `${props.id}/container/${props.file}`
    };
  }

  async componentDidMount () {
    const { containerId, file } = this.state;
    const container = document.getElementById(containerId);

    const view = { target: [0, 0, 0], position: [0, -200, 0], up: [0, 1, 0] };

    const page = document.createElement('div');
    page.id = 'viewer';
    page.style.height = '100%';

    const { updateGeometry } = await orbitDisplay({ view, geometry: { assembly: [] } }, page);

    const geometryPath = file;

    const readAndUpdate = async () => {
      const json = await readFile({}, geometryPath);
      if (json === undefined) {
        await updateGeometry({ assembly: [] });
      } else {
        await updateGeometry(JSON.parse(json));
      }
    };

    await readAndUpdate();

    const watcher = await watchFile(geometryPath, readAndUpdate);

    this.setState({ watcher });

    container.appendChild(page);
  }

  async componentWillUnmount () {
    const { containerId, watcher } = this.state;
    const container = document.getElementById(containerId);

    while (true) {
      const child = container.firstElementChild;
      if (child) {
        container.removeChild(child);
        continue;
      }
      break;
    }

    if (watcher) {
      await unwatchFiles(watcher);
    }
  }

  renderToolbarActions () {
    const { file } = this.state;
    if (file === undefined || file === 'geometry/preview') {
      return [];
    }
    const filePath = `output/${file.substring(9)}`;
    return (
      <Nav.Item>
        <Nav.Link onClick={() => downloadFile(filePath)} style={{ color: 'blue' }}>
          Download
        </Nav.Link>
      </Nav.Item>
    );
  }

  renderToolbar () {
    return super.renderToolbar(this.renderToolbarActions());
  }

  renderPane () {
    const { id } = this.props;
    const { file, containerId } = this.state;
    if (file === undefined) {
      return [];
    }
    return (
      <Container key={id} style={{ height: '100%', display: 'flex', flexFlow: 'column' }}>
        <Row style={{ width: '100%', height: '100%', flex: '1 1 auto' }}>
          <Col style={{ width: '100%', height: '100%', overflow: 'auto' }}>
            <div id={containerId}></div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ViewUi;
