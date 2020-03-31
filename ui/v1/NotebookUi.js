/* global Blob */

import {
  dataUrl,
  orbitDisplay
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
import Pane from './Pane';
import PropTypes from 'prop-types';
import React from 'react';
import ResizableBox from './ResizableBox';
import Row from 'react-bootstrap/Row';
import Shape from '@jsxcad/api-v1-shape';
import marked from 'marked';
import saveAs from 'file-saver';

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

    const view = { target: [0, 0, 0], position, up: [0, 0, 1] };

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

const downloadFile = async (filename, data, type) => {
  const blob = new Blob([data.buffer], { type });
  saveAs(blob, filename);
};

export class DownloadView extends React.PureComponent {
  static get propTypes () {
    return {
      id: PropTypes.string,
      entries: PropTypes.array
    };
  }

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const { entries } = this.props;

    const makeDownloadButton = ({ filename, data, type }, index) => {
      return <Button key={index} variant='outline-primary' onClick={() => downloadFile(filename, data, type)}>
        {filename}
      </Button>;
    };

    return <ButtonGroup>{entries.map(makeDownloadButton)}</ButtonGroup>;
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
    const { selected = -1 } = this.state;

    const notebook = await readFile({}, 'notebook');
    const notes = this.buildNotes({ notebook, selected });

    this.setState({ notebook, notes });
  }

  buildNotes ({ notebook = [], selected = -1 }) {
    const notes = [];
    let nth = 0;
    for (const note of notebook) {
      nth += 1;
      const isSelected = (nth === selected);
      const key = Math.random(); // nth;
      if (note.geometry) {
        const index = nth;
        const { width, height, position, geometry } = note.geometry;
        const mode = (index === selected) ? 'dynamic' : 'static';
        const select = (e) => {
          e.stopPropagation();
          const notes = this.buildNotes({ ...this.state, selected: index });
          this.setState({ selected: index, notes });
        };
        notes.push(<GeometryView key={key} width={width} height={height} position={position} geometry={geometry} onClick={select} mode={mode} isSelected={isSelected}/>);
      } else if (note.md) {
        const data = note.md;
        notes.push(<div key={key} dangerouslySetInnerHTML={{ __html: marked(data) }}/>);
      } else if (note.download) {
        const { entries } = note.download;
        if (entries) {
          notes.push(<DownloadView key={key} entries={entries}/>);
        }
      }
    }
    return notes;
  }

  renderPane () {
    const { id } = this.props;
    const { notes = [] } = this.state;

    const unselect = async () => {
      const { notebook } = this.state;
      const notes = this.buildNotes({ notebook });
      this.setState({ selected: -1, notes });
      await this.update();
    };

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
