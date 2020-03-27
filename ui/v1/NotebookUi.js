import {
  dataUrl,
  orbitDisplay
} from '@jsxcad/ui-threejs';

import {
  readFile,
  unwatchFiles,
  watchFile
} from '@jsxcad/sys';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Pane from './Pane';
import PropTypes from 'prop-types';
import React from 'react';
import ResizableBox from './ResizableBox';
import Row from 'react-bootstrap/Row';
import Shape from '@jsxcad/api-v1-shape';
import marked from 'marked';

export class OrbitView extends React.PureComponent {
  static get propTypes () {
    return {
      id: PropTypes.string,
      geometry: PropTypes.object,
      width: PropTypes.number,
      height: PropTypes.number,
      position: PropTypes.array
    };
  }

  constructor (props) {
    super(props);
    this.state = {
      containerId: `${props.id}/container`
    };
  }

  async componentDidMount () {
    const { containerId } = this.state;
    const { geometry, position } = this.props;
    const container = document.getElementById(containerId);

    const view = { target: [0, 0, 0], position, up: [0, 1, 0] };

    const page = document.createElement('div');
    page.id = 'viewer';
    page.style.height = '100%';

    await orbitDisplay({ view, geometry }, page);

    /*

    const geometryPath = path;

    const readAndUpdate = async () => {
      const data = await readFile({}, geometryPath);
      if (data === undefined) {
        await updateGeometry({ assembly: [] });
      } else {
        if (data.buffer) {
          await updateGeometry(JSON.parse(new TextDecoder('utf8').decode(data)));
        } else {
          await updateGeometry(data);
        }
      }
    };

    await readAndUpdate();

    const watcher = await watchFile(geometryPath, readAndUpdate);

    this.setState({ watcher });
*/

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

  render () {
    const { containerId } = this.state;
    const { width, height } = this.props;
    return (
      <ResizableBox className="box"
        width={width}
        height={height}
        style={{ borderStyle: 'solid', borderWidth: 'thin', borderColor: 'blue', display: 'inline-block' }}
        onClick={(e) => e.stopPropagation()}
        handle={(resizeHandle) => <span className={`react-resizable-handle react-resizable-handle-${resizeHandle}`} style={{ zIndex: 2 }} />}>
        <div id={containerId} style={{ borderStyle: 'solid', borderWidth: 'thin' }}></div>
      </ResizableBox>
    );
  }
}

export class StaticView extends React.PureComponent {
  static get propTypes () {
    return {
      id: PropTypes.string,
      geometry: PropTypes.object,
      width: PropTypes.number,
      height: PropTypes.number,
      position: PropTypes.array,
      onClick: PropTypes.func
    };
  }

  constructor (props) {
    super(props);
    this.state = {};
  }

  async componentDidMount () {
    const { geometry, width, height, position } = this.props;

    // const data = await readFile({}, path);
    const url = await dataUrl(Shape.fromGeometry(geometry), { width, height, position });

    this.setState({ url });
  }

  render () {
    const { onClick } = this.props;
    const { url } = this.state;
    return <div style= {{ display: 'inline-block' }}><img src={url} onClick={onClick} style={{ borderStyle: 'dotted', borderWidth: 'thin', verticalAlign: 'baseline' }}/></div>;
  }
}

export class GeometryView extends React.PureComponent {
  static get propTypes () {
    return {
      id: PropTypes.string,
      width: PropTypes.number,
      height: PropTypes.number,
      position: PropTypes.array,
      onClick: PropTypes.func,
      mode: PropTypes.string,
      isSelected: PropTypes.bool,
      geometry: PropTypes.object
    };
  }

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const { id, geometry, width, height, position, mode, onClick } = this.props;
    switch (mode) {
      case 'static':
        return <StaticView geometry={geometry} width={width} height={height} position={position} onClick={onClick}/>;
      case 'dynamic':
        return <OrbitView id={id} geometry={geometry} width={width} height={height} position={position}/>;
    }
  }
}

export class NotebookUi extends Pane {
  static get propTypes () {
    return {
      id: PropTypes.string
    };
  }

  constructor (props) {
    super(props);
    this.state = {};
    this.update = this.update.bind(this);
  }

  async componentDidMount () {
    const watcher = await watchFile('notebook', this.update);
    this.setState({ watcher });
    await this.update();
  }

  async componentWillUnmount () {
    const { watcher } = this.state;

    if (watcher) {
      await unwatchFiles(watcher);
    }
  }

  async update () {
    const notebook = await readFile({}, 'notebook');
    this.setState({ notebook });
  }

  renderPane () {
    const { id } = this.props;
    const { notebook = [], selected = -1 } = this.state;

    const notes = [];
    let nth = 0;
    for (const note of notebook) {
      nth += 1;
      if (note.geometry) {
        const index = nth;
        const isSelected = (index === selected);
        const { width, height, position, geometry } = note.geometry;
        const mode = (index === selected) ? 'dynamic' : 'static';
        const select = (e) => {
          e.stopPropagation();
          this.setState({ selected: index });
        };
        notes.push(<GeometryView key={nth} width={width} height={height} position={position} geometry={geometry} onClick={select} mode={mode} isSelected={isSelected}/>);
      } else if (note.md) {
        const data = note.md;
        notes.push(<div key={nth} dangerouslySetInnerHTML={{ __html: marked(data) }}/>);
      }
    }

    const unselect = () => this.setState({ selected: -1 });

    return (
      <Container key={id} style={{ height: '100%', display: 'flex', flexFlow: 'column' }}>
        <Row style={{ width: '100%', height: '100%', flex: '1 1 auto' }}>
          <Col style={{ width: '100%', height: '100%', overflow: 'auto' }} onClick={unselect}>
            {notes}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default NotebookUi;
