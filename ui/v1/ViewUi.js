/* global Blob, ResizeObserver, window */

import {
  buildGui,
  buildGuiControls,
  buildMeshes,
  buildScene,
  buildTrackballControls,
  createResizer,
  drawHud
} from '@jsxcad/ui-threejs';
import {
  readFile,
  unwatchFiles,
  watchFile
} from '@jsxcad/sys';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import PropTypes from 'prop-types';
import React from 'react';
import Row from 'react-bootstrap/Row';
import saveAs from 'file-saver';
import { toThreejsGeometry } from '@jsxcad/convert-threejs';

const downloadFile = async (path) => {
  const data = await readFile({ as: 'bytes' }, path);
  const blob = new Blob([data.buffer], { type: 'application/octet-stream' });
  saveAs(blob, path.split('/').pop());
};

export class ViewUi extends React.PureComponent {
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

    const view = { target: [0, 0, 0], position: [0, 0, 200], up: [0, 1, 0] };
    let datasets = [];
    let threejsGeometry;
    let width = container.offsetWidth;
    let height = container.offsetHeight;

    const { camera, hudCanvas, renderer, scene, viewerElement } = buildScene({ width, height, view });
    const { gui } = buildGui({ viewerElement });
    const hudContext = hudCanvas.getContext('2d');

    const render = () => {
      renderer.clear();
      camera.layers.set(0);
      renderer.render(scene, camera);

      renderer.clearDepth();
      camera.layers.set(1);
      renderer.render(scene, camera);
    };

    const updateHud = () => {
      hudContext.clearRect(0, 0, width, height);
      drawHud({ camera, datasets, threejsGeometry, hudCanvas });
      // hudContext.fillStyle = '#FF0000';
      hudContext.fillStyle = '#00FF00';
    };

    container.appendChild(viewerElement);

    const animate = () => {
      updateHud();
      render();
    };

    const { trackball } = buildTrackballControls({ camera, render: animate, view, viewerElement });

    const { resize } = createResizer({ camera, trackball, renderer, viewerElement });

    resize();
    new ResizeObserver(() => {
      ({ width, height } = resize());
      hudCanvas.width = width;
      hudCanvas.height = height;
    })
        .observe(container);

    const track = () => {
      animate();
      trackball.update();
      window.requestAnimationFrame(track);
    };

    track();

    const geometryPath = file;

    const updateGeometry = (geometry) => {
      if (geometry !== undefined) {
        // Delete any previous dataset in the window.
        const controllers = new Set();
        for (const { controller, mesh } of datasets) {
          if (controller) {
            controllers.add(controller);
          }
          scene.remove(mesh);
        }
        for (const controller of controllers) {
          gui.remove(controller.ui);
        }

        threejsGeometry = toThreejsGeometry(geometry);

        // Build new datasets from the written data, and display them.
        datasets = [];

        buildMeshes({ datasets, threejsGeometry, scene });
        buildGuiControls({ datasets, gui });
      }
    };

    const json = await readFile({}, geometryPath);
    if (json !== undefined) {
      updateGeometry(JSON.parse(json));
    }

    const watcher = await watchFile(geometryPath,
                                    async () => updateGeometry(JSON.parse(await readFile({}, geometryPath))));

    this.setState({ watcher });
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

  render () {
    const { id } = this.props;
    const { file, containerId } = this.state;
    const filePath = `source/${file.substring(9)}`;

    const buttons = (file === 'geometry/preview')
      ? []
      : <Row style={{ flex: '0 0 auto' }}>
        <Col>
          <br/>
          <ButtonGroup>
            <Button size='sm'
              onClick={() => downloadFile(filePath)}
              variant='outline-primary'>
                              Download
            </Button>
          </ButtonGroup>
        </Col>
      </Row>;

    return (
      <Container key={id} style={{ height: '100%', display: 'flex', flexFlow: 'column' }}>
        <Row style={{ width: '100%', height: '100%', flex: '1 1 auto' }}>
          <Col style={{ width: '100%', height: '100%', overflow: 'auto' }}>
            <div id={containerId}></div>
          </Col>
        </Row>
        {buttons}
      </Container>
    );
  }
}

export default ViewUi;
