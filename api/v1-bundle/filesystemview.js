/* global Blob, FileReader, ResizeObserver */

Error.stackTraceLimit = Infinity;

import './codemirror-global';
import 'codemirror/mode/javascript/javascript.js';

import { buildGui, buildGuiControls, buildTrackballControls } from '@jsxcad/convert-threejs/controls';
import { buildMeshes, drawHud } from '@jsxcad/convert-threejs/mesh';
import { buildScene, createResizer } from '@jsxcad/convert-threejs/scene';
import { createService, deleteFile, getFilesystem, listFiles, listFilesystems, log, readFile, setupFilesystem, unwatchFile, unwatchFileCreation, unwatchFileDeletion, unwatchLog, watchFile, watchLog, watchFileCreation, watchFileDeletion, writeFile } from '@jsxcad/sys';
import { fromZipToFilesystem, toZipFromFilesystem } from '@jsxcad/convert-zip';

import { UnControlled as CodeMirror } from 'react-codemirror2';
import React from 'react';
import ReactDOM from 'react-dom';
import SvgPathEditor from './SvgPathEditor';
import { jsPanel } from 'jspanel4';
import saveAs from 'file-saver';
import { toThreejsGeometry } from '@jsxcad/convert-threejs';
import Recollect from 'react-recollect';

import PrismJS from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

import BaseGridLayout, { WidthProvider } from 'react-grid-layout-fabric';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Draggable from 'react-draggable';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import SplitButton from 'react-bootstrap/SplitButton';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

import Editor from 'react-simple-code-editor';

import Drawer from 'rc-drawer';

const GridLayout = WidthProvider(BaseGridLayout);

const once = (op) => {
  let triggered = false;
  const guard = (...args) => {
    if (triggered) { return; }
    triggered = true;
    return op(...args);
  }
  return guard;
}

class UI extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      projects: this.props.projects,
      layout: [],
      panes: [],
      project: this.props.project,
      build: 0,
    };

    this.addLayout = this.addLayout.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.addProject = this.addProject.bind(this);

    this.switchingProjects = false;
  }

  async componentDidMount () {
    const { project } = this.state;

    const self = this;
    const fileUpdater = () => listFilesystems().then(projects => self.setState({ projects }));
    const creationWatcher = watchFileCreation(fileUpdater);
    const deletionWatcher = watchFileDeletion(fileUpdater);
    this.setState({ creationWatcher, deletionWatcher });

    if (project) {
      await this.selectProject(project);
    }
  }

  async componentWillUnmount () {
    const { creationWatcher, deletionWatcher } = this.state;

    unwatchFileCreation(creationWatcher);
    unwatchFileDeletion(deletionWatcher);
  }

  async addLayout (paneLayout) {
    if (!this.state.layout.some(entry => entry.i === paneLayout.i)) {
      const layout = [...this.state.layout, paneLayout];
      this.setState({ layout });
      return this.buildPanes(layout);
    }
  }

  async buildPanes (layout) {
    const panes = [];
    const build = this.state.build + 1;

    for (const { i } of layout) {
      const key = i;
      const [fs, op, ...args] = i.split(':');
      switch (op) {
        case 'log':
          panes.push(<LogUI key={key} ui={this} project={fs}></LogUI>);
          break;
        case 'project': {
          panes.push(<ProjectUI key={key} ui={this} project={fs}></ProjectUI>);
          break;
        }
        case 'editScript': {
          const [path] = args;
          panes.push(<JSEditorUI key={key} ui={this} path={path}></JSEditorUI>);
          break;
        }
        case 'editSvgPath':
          panes.push(await editSvgPath(key, ...args));
          break;
        case 'viewGeometry': {
          const [path] = args;
          panes.push(<ViewUI key={key} ui={this} path={path}></ViewUI>);
          break;
        }
      }
    }

    this.setState({ build, panes });
  }

  async addProject () {
    const project = document.getElementById('project/add/name').value;
    if (project.length > 0) {
      // FIX: Prevent this from overwriting existing filesystems.
      setupFilesystem({ fileBase: project });
      await writeFile({}, 'file/script.jsx', defaultScript);
      await this.selectProject(project);
    }
  };

  async selectProject (project) {
    setupFilesystem({ fileBase: project });
    const encodedProject = encodeURIComponent(project);
    history.pushState(null, null, `#${encodedProject}`);
    const layoutData = await readFile({}, 'ui/layout');
    let layout;
    if (layoutData !== undefined) {
      layout = JSON.parse(layoutData);
      if (layout.length) {
        for (const entry of layout) {
          if (entry === undefined) {
            throw Error('die');
          }
        }
      }
    } else {
      layout = [];
    }

    // FIX: Remove patch.
    layout = layout.filter(entry => entry.i.startsWith(`${project}:`));

    if (!layout.some(entry => entry.i === `${project}:project`)) {
      layout.push({ x: 0, y: 0, w: 2, h: 5, i: `${project}:project` });
    }
    this.switchingProjects = true;
    this.setState({ layout, project });
    this.switchingProjects = false;
    await this.buildPanes(layout);
  };

  closeProject () {
    this.setState({ project: '' });
  }

  async onLayoutChange (layout) {
    if (this.switchingProjects) { return; }
    this.setState({ layout });
    await writeFile({}, 'ui/layout', JSON.stringify(layout));
  }

  removePane (pane) {
    if (pane.props.shutdown) {
      setTimeout(pane.props.shutdown, 100);
    }
    const panes = this.state.panes.filter(item => item !== pane);
    this.setState({ panes });
  }

  showPane (pane) {
    if (pane.props.setup) {
      setTimeout(pane.props.setup, 100);
    }
    return pane;
  }

  toLayoutEntry (pane) {
    for (const entry of this.state.layout) {
      if (entry === undefined) {
        throw Error('die');
      }
      if (entry.i === pane.key) {
        return entry;
      }
    }
    return { x: 0, y: 0, w: 2, h: 2, i: pane.key };
  }

  render () {
    const self = this;
    const { project } = this.state;
    const { cols, rowHeight } = this.props;
    const prefix = `${project}:`;

    return (
      <div>
        <Drawer width="20vw" placement="left" open={project === '' ? true : undefined} defaultOpen={project === '' ? true: undefined}>
          <InputGroup>
            <FormControl id="project/add/name" placeholder="Project Name" />
            <InputGroup.Append>
              <Button onClick={this.addProject} variant='outline-primary'>Add Project</Button>
            </InputGroup.Append>
          </InputGroup>
          <br/>
          <ButtonGroup vertical>
            {this.state
                 .projects
                 .map((project, index) =>
                      <Button key={index} variant="outline-primary" style={{ textAlign: 'left' }} onClick={() => self.selectProject(project)}>
                        {project}
                      </Button>)}
          </ButtonGroup>
        </Drawer>
        <GridLayout onLayoutChange={this.onLayoutChange}
                    compactType={'vertical'}
                    width="100%" height="100%" cols={cols} rowHeight={rowHeight}
                    layout={this.state.layout}>
          {this.state
               .panes
               .filter(pane => pane.key.startsWith(prefix))
               .map(pane =>
                    <div key={pane.key} style={{ display: 'block' }} data-grid={this.toLayoutEntry(pane)}>
                      {this.showPane(pane)}
                      <span style={{position: 'absolute', right: '2px', top: 0, cursor: 'pointer'}} onClick={() => self.removePane(pane)}>
                        &#128473;
                      </span>
                    </div>)}
        </GridLayout>
      </div>
    );
  }
};

class ProjectUI extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      paths: [],
      project: '',
    };

    this.addFile = this.addFile.bind(this);
    this.importProject = this.importProject.bind(this);
    this.exportProject = this.exportProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
  }

  async componentDidMount () {
    const self = this;
    const paths = new Set(await listFiles());
    const project = getFilesystem();
    const fileUpdater = () => listFiles().then(files => self.setState({ paths: new Set(files) }));
    const creationWatcher = watchFileCreation(fileUpdater);
    const deletionWatcher = watchFileDeletion(fileUpdater);
    this.setState({ paths, project, creationWatcher, deletionWatcher });
  }

  async componentWillUnmount () {
    const { creationWatcher, deletionWatcher } = this.state;

    unwatchFileCreation(creationWatcher);
    unwatchFileDeletion(deletionWatcher);
  }

  handler (action, file) {
    const { project, ui } = this.props;

    switch (action) {
      case 'Delete':
        return async () => deleteFile({}, `file/${file}`);
      case 'Download':
        return async () => downloadFile(`file/${file}`);
      case 'Edit Script':
        return async () => {
          await ui.addLayout({ x: 2, y: 0, w: 5, h: 5, i: `${project}:editScript:${file}` });
        }
      case 'Edit SvgPath':
        return async () => editSvgPath(file);
      case 'Run':
        return async () => runScript(ui, file);
      case 'View':
        return async () => {
          await ui.addLayout({ x: 7, y: 0, w: 5, h: 5, i: `${project}:viewGeometry:${file}` });
        }
    }
  }

  buildFiles () {
    const { paths } = this.state;

    const buttons = [];
    for (const path of paths) {
      if (!path.startsWith('file/')) {
        continue;
      }
      const file = path.substring(5);
      const todo = [];

      if (paths.has(`geometry/${file}`)) {
        todo.push('View');
      }
      if (path.endsWith('.jsx')) {
        todo.push('Edit Script');
        todo.push('Run');
      }
      if (path.endsWith('.svp')) {
        todo.push('Edit SvgPath');
      }

      todo.push('Download');
      todo.push('Delete');

      const primary = todo.shift();
      const secondary = todo;

      const doPrimary = this.handler(primary, file);
      const doSecondary = secondary.map(action => this.handler(action, file));

      buttons.push(<tr key={buttons.length}>
                     <td>
                       <DropdownButton size="sm" title={file} variant="outline-primary">
                         <Dropdown.Item key={-1} onClick={doPrimary}>{primary}</Dropdown.Item>
                         {secondary.map((label, index) =>
                                        <Dropdown.Item key={index} onClick={doSecondary[index]}>{label}</Dropdown.Item>)}
                       </DropdownButton>
                     </td>
                   </tr>);
    }
    return buttons;
  }

  stop (e) {
    e.stopPropagation();
  }

  clickImportProject () {
    document.getElementById('project/import').click();
  }

  async addFile () {
    const file = document.getElementById('fs/file/add').value;
    if (file.length > 0) {
      // FIX: Prevent this from overwriting existing files.
      await writeFile({}, `file/${file}`, '');
    }
  };

  async exportProject () {
    const zip = await toZipFromFilesystem();
    const blob = new Blob([data.buffer], { type: 'application/zip' });
    saveAs(blob, getFilesystem());
  };

  async importProject (e) {
    const file = document.getElementById('fs/filesystem/import').files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const zip = e.target.result;
      fromZipToFilesystem({}, zip).then(_ => _);
    };
    reader.readAsArrayBuffer(file);
  };

  async deleteProject () {
    for (const file of await listFiles()) {
      await deleteFile({}, file);
    }
    this.props.ui.closeProject();
  }

  render () {
    const { project } = this.state;

    return (
      <Container key={this.key} style={{ height: '100%', display: 'flex', flexFlow: 'column', padding: '4px', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}>
        <Row style={{ flex: '0 0 auto' }}>
          <Col>
            <Card.Title>{project}</Card.Title>
          </Col>
        </Row>
        <Row style={{ flex: '1 1 auto', overflow: 'auto' }}>
          <Col>
            <Table size='sm'>
              <tbody>
                {this.buildFiles()}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row style={{ flex: '0 0 auto' }}>
          <Col>
            <Card.Title>Actions</Card.Title>
          </Col>
        </Row>
        <Row style={{ flex: '0 0 auto' }}>
          <Col onMouseDown={this.stop} onMouseMove={this.stop} onMouseUp={this.stop} style={{ height: '100%' }}>
            <InputGroup>
              <FormControl id="project/add/name" placeholder="File Name" />
              <InputGroup.Append>
                <Button onClick={this.addFile} variant='outline-primary'>Add</Button>
              </InputGroup.Append>
            </InputGroup>
            <InputGroup>
              <FormControl id="project/export/name" placeholder="Zip Name" />
              <InputGroup.Append>
                <Button onClick={this.exportProject} variant='outline-primary'>Export</Button>
              </InputGroup.Append>
            </InputGroup>
            <InputGroup>
              <FormControl as="input" type="file" multiple={false} id="project/import" onChange={this.importProject} style={{ display: 'none' }} />
              <FormControl disabled placeholder="" />
              <InputGroup.Append>
                <Button onClick={this.clickImportProject} id="project/import/button" variant="outline-primary">Import</Button>
              </InputGroup.Append>
            </InputGroup>
            <InputGroup>
              <FormControl disabled placeholder="" />
              <InputGroup.Append>
                <Button onClick={this.deleteProject} id="project/delete/button" variant="outline-primary">Delete</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
      </Container>
    );
  }
};

class ViewUI extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      path: props.path,
      containerId: `${this.key}/container`
    }
  }

  async componentDidMount () {
    const { containerId, path } = this.state;
    const container = document.getElementById(containerId);

    const view = { target: [0, 0, 0], position: [0, 0, 200], up: [0, 1, 0] };
    let datasets = [];
    let threejsGeometry;
    let width = container.offsetWidth;
    let height = container.offsetHeight;
    const { camera, hudCanvas, renderer, scene, viewerElement } = buildScene({ width, height, view });
    const { gui } = buildGui({ viewerElement });
    const hudContext = hudCanvas.getContext('2d');
    const render = () => renderer.render(scene, camera);
    const updateHud = () => {
      hudContext.clearRect(0, 0, width, height);
      drawHud({ camera, datasets, threejsGeometry, hudCanvas });
      hudContext.fillStyle = '#FF0000';
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

    const geometryPath = `geometry/${path}`;

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

    const watcher = watchFile(geometryPath,
                              async () => updateGeometry(JSON.parse(await readFile({}, geometryPath))));

    this.setState({ watcher });
  }

  componentWillUnmount () {
    const { watcher } = this.state;
    if (watcher) {
      unwatchFile(watcher);
    }
  }

  render () {
    const { path, containerId } = this.state;

    return (
      <Card key={this.key} style={{ height: '100%', overflow: 'hidden', display: 'block'}}>
        <Card.Body style={{ height: '100%', width: '100%', overflow: 'hidden', display: 'block'}}>
          <Card.Title>View: {path}</Card.Title>
          <div id={containerId}></div>
        </Card.Body>
      </Card>
    );
  }
}

class JSEditorUI extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      code: ''
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.run = this.run.bind(this);
    this.save = this.save.bind(this);
  }

  async run () {
    const { path, ui } = this.props;

    await this.save();
    await runScript(path, ui);
  }

  async save () {
    const { code } = this.state;
    await writeFile({}, `file/${this.props.path}`, code);
  }

  async componentDidMount () {
    const code = await readFile({}, `file/${this.props.path}`);
    this.setState({ code });
  }

  onValueChange (code) {
    this.setState({ code });
  }

  highlight (code) {
    return PrismJS.highlight(code, PrismJS.languages.js);
  }

  stop (e) {
    e.stopPropagation();
  }

  preventDefault (e) {
    e.preventDefault();
    return false;
  }

  onKeyDown (e) {
    const ENTER = 13;
    const S = 83;
    const SHIFT = 16;
    const CONTROL = 17;

    const key = e.which || e.keyCode || 0;

    switch (key) {
      case CONTROL:
      case SHIFT:
        return true;
    }

    const { ctrlKey, shiftKey } = e;
    switch (key) {
      case ENTER: {
        if (shiftKey) {
          e.preventDefault();
          e.stopPropagation();
          this.run();
          return false;
        }
        break;
      }
      case S: {
        if (ctrlKey) {
          e.preventDefault();
          e.stopPropagation();
          this.save();
          return false;
        }
        break;
      }
    }
  }

  /* Row style={{ width: '100%', height: '100%', flex: '1 1 auto' }} onMouseDown={this.stop} onMouseMove={this.stop} onMouseUp={this.stop} onKeyDown={this.preventDefault} onKeyPress={this.preventDefault} */

  render () {
    const self = this;
    const { code } = this.state;

    return (
      <Container style={{ height: '100%', display: 'flex', flexFlow: 'column', padding: '4px', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}>
        <Row style={{ flex: '0 0 auto' }}>
          <Col>
            <Card.Title>{this.props.path}</Card.Title>
          </Col>
        </Row>
        <Row style={{ width: '100%', height: '100%', flex: '1 1 auto' }} onMouseDown={this.stop} onMouseMove={this.stop} onMouseUp={this.stop}>
          <Col style={{ width: '100%', height: '100%', overflow: 'auto' }} onKeyDown={this.onKeyDown}>
            <Editor key={this.key}
                    value={code}
                    onValueChange={this.onValueChange}
                    highlight={this.highlight}
                    padding={10}
                    style={{ fontFamily: '"Fira code", "Fira Mono", monospace', fontSize: 12, border: '1px solid turquoise' }}>
            </Editor>
          </Col>
        </Row>
        <Row style={{ flex: '0 0 auto' }} onMouseDown={this.stop} onMouseMove={this.stop} onMouseUp={this.stop}>
          <Col>
            <br/>
            <ButtonGroup>
              <Button onClick={this.run} variant='outline-primary'>
                Run
              </Button>
              <Button onClick={this.save} variant='outline-primary'>
                Save
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    );
  }
};

class LogUI extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      mode: 'idle',
      viewerElementId: `${this.key}/viewer`,
    }
  }

  async componentDidMount () {
    const self = this;
    const { viewerElementId } = this.state;

    const viewerElement = document.getElementById(viewerElementId);

    const watcher = watchLog((entry) => {
                             switch (typeof entry) {
                               case 'string':
                                 const div = viewerElement.appendChild(document.createElement('div'));
                                 div.appendChild(document.createTextNode(entry));
                                 div.style.cssText = 'border: 1px solid black; border-radius: 4px; padding: 2px; width: 100%';
                                 viewerElement.parentNode.scrollTop = viewerElement.parentNode.scrollHeight;
                                 break;
                               case 'object':
                                 const { op, status } = entry;
                                 switch (op) {
                                   case 'evaluate':
                                     switch (status) {
                                       case 'run':
                                         self.setState({ mode: 'run' });
                                         break;
                                       default:
                                         self.setState({ mode: 'idle' });
                                     }
                                     break;
                                   case 'clear':
                                     while (viewerElement.firstChild) {
                                       viewerElement.removeChild(viewerElement.firstChild);
                                     }
                                     break;
                                 }
                             }
                           });

    this.setState({ watcher });
  }

  componentWillUnmount = () => {
    const { watcher } = this.state;

    if (watcher) {
      unwatchLog(watcher);
    }
  }

  render () {
    const { mode, viewerElementId } = this.state;

    return (
      <Container key={this.key}
                 style={{ height: '100%', display: 'flex', flexFlow: 'column',
                          padding: '4px', border: '1px solid rgba(0,0,0,.125)',
                          borderRadius: '.25rem' }}>
        <Row style={{ flex: '0 0 auto' }}>
          <Col>
            <Card.Title style={{ display: 'inline-block' }}>Log</Card.Title>
            {mode === 'run' && <Spinner animation="border" size="sm" style={{ position: 'absolute', right: '30px', top: '2px' }}><span className="sr-only">Running</span></Spinner>}
          </Col>
        </Row>
        <Row style={{ flex: '1 1 auto', height: '100%', overflow: 'auto' }}>
          <div id={viewerElementId} style={{ paddingLeft: '20px', width: '100%' }}></div>
        </Row>
      </Container>
    );
  }
}

// const UI = Recollect.collect(UIBase);

let panels = new Set();

const buttonStyle = [
  `box-shadow:inset 0px 1px 0px 0px #ffffff;`,
  `background-color:#f9f9f9;`,
  `-moz-border-radius:6px;`,
  `-webkit-border-radius:6px;`,
  `border-radius:6px;`,
  `border:1px solid #dcdcdc;`,
  `display:inline-block;`,
  `cursor:pointer;`,
  `color:black;`,
  `font-family:Arial;`,
  `font-size:15px;`,
  `font-weight:bold;`,
  `padding:6px 24px;`,
  `margin:4px;`,
  `text-decoration:none;`,
  `text-shadow:0px 1px 0px #ffffff;`,
  `align-self: flex-end;`
].join(' ');

let ui;

const installUI = async () => {
  const filesystems = await listFilesystems();
  const hash = location.hash.substring(1);
  const [encodedProject] = hash.split('@');
  const project = decodeURIComponent(encodedProject);
  ui = ReactDOM.render(<UI projects={[...filesystems]} project={project} width="100%" height="100%" cols={24} rowHeight={30} breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}>
                       </UI>,
                       document.getElementById('top'));
  return ui;
}

const displayProjectsEntry = (project, index) => {
  const deleteProject = async () => {
                          setupFilesystem({ fileBase: project });
                          for (const file of await listFiles()) {
                            await deleteFile({}, file);
                          }
                          ui.dropKeys(['projects', 'project']);
                          setupFilesystem({ fileBase: '' });
                          await displayProjects();
                        };

  const selectProject = async () => {
                          setupFilesystem({ fileBase: project });
                          ui.keepKeys(['projects', 'project']);
                          const layoutsData = await readFile({}, 'ui/layout');
                          if (layoutsData !== undefined) {
                            const layouts = JSON.parse(layoutsData);
                            await ui.restoreLayout(layouts);
                          }
                          await displayProject(project);
                        };
  return (
    <tr key={index}>
      <td>
        <SplitButton size="sm" id="dropdown-basic-button" title={project} variant="outline-primary" onClick={selectProject}>
          <Dropdown.Item onClick={deleteProject}>Delete</Dropdown.Item>
        </SplitButton>
      </td>
    </tr>
  );
};

const displayProjects = async () => {
  const stop = (e) => e.stopPropagation();

  return await (
    <Container style={{ height: '100%', display: 'flex', flexFlow: 'column', padding: '4px', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}>
      <Row style={{ flex: '0 0 auto' }}>
        <Col>
          <Card.Title>Projects</Card.Title>
        </Col>
      </Row>
      <Row style={{ flex: '1 1 auto', overflow: 'auto' }}>
        <Col>
          <Table size='sm'>
            <tbody>
              {(await listFilesystems()).map(displayProjectsEntry)}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row style={{ flex: '0 0 auto' }}>
        <Col>
          <Card.Title>Actions</Card.Title>
        </Col>
      </Row>
      <Row style={{ flex: '0 0 auto' }}>
        <Col onMouseDown={stop} onMouseMove={stop} onMouseUp={stop} style={{ height: '100%' }}>
          <InputGroup>
            <InputGroup.Prepend>
              <Button onClick={newProject} id="projects/new" variant='outline-primary'>New Project</Button>
            </InputGroup.Prepend>
            <FormControl id="projects/new/name" placeholder="Project Name" />
          </InputGroup>
        </Col>
      </Row>
    </Container>
  );

  // ui.addItem(projects, { key: 'projects', width: 2, height: 3, removeable: false });
};

// FIX: Rename as log.
const viewLog = async (key) => {
  // ui.addItem(log, { key, x: 2, width: 5, height: 1, removeable: false });

  let watcher;

  const setup = () => {
    const viewerElement = document.getElementById('log');
    if (viewerElement === null) {
      setTimeout(setup, 100);
      return;
    }
    watcher = watchLog((entry) => {
                         const div = viewerElement.appendChild(document.createElement('div'));
                         div.appendChild(document.createTextNode(entry));
                         div.style.cssText = 'border: 1px solid black; border-radius: 4px; padding: 2px; width: 100%';
                         viewerElement.parentNode.scrollTop = viewerElement.parentNode.scrollHeight;
                       });
  }

  const shutdown = () => {
    if (watcher) {
      unwatchLog(watcher);
    }
  }

  const setupOnce = once(setup);
  const shutdownOnce = once(shutdown);

  const log = await (
    <Container key={key} setup={setupOnce} shutdown={shutdownOnce} style={{ height: '100%', display: 'flex', flexFlow: 'column', padding: '4px', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}>
      <Row style={{ flex: '0 0 auto' }}>
        <Col>
          <Card.Title>Log</Card.Title>
        </Col>
      </Row>
      <Row style={{ flex: '1 1 auto', height: '100%', overflow: 'auto' }}>
        <div id='log' style={{ paddingLeft: '20px', width: '100%' }}></div>
      </Row>
    </Container>
  );

  return log;
}

const viewGeometry = async (key, path) => {
  const containerId = `${key}/container`
  let isSetup = false;

  let watcher;

  const setup = async () => {
    const container = document.getElementById(containerId);

    if (container === null) {
      setTimeout(setup, 100);
      return;
    }

    const view = { target: [0, 0, 0], position: [0, 0, 200], up: [0, 1, 0] };
    let datasets = [];
    let threejsGeometry;
    let width = container.offsetWidth;
    let height = container.offsetHeight;
    const { camera, hudCanvas, renderer, scene, viewerElement } = buildScene({ width, height, view });
    const { gui } = buildGui({ viewerElement });
    const hudContext = hudCanvas.getContext('2d');
    const render = () => renderer.render(scene, camera);
    const updateHud = () => {
      hudContext.clearRect(0, 0, width, height);
      drawHud({ camera, datasets, threejsGeometry, hudCanvas });
      hudContext.fillStyle = '#FF0000';
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

    const geometryPath = `geometry/${path}`;

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

    watcher = watchFile(geometryPath,
                        async () => updateGeometry(JSON.parse(await readFile({}, geometryPath))));
  }

  const shutdown = () => {
    if (watcher) {
      unwatchFile(watcher);
    }
  }

  const setupOnce = once(setup);
  const shutdownOnce = once(shutdown);

  const viewer = await (
    <Card key={key} style={{ height: '100%', overflow: 'hidden', display: 'block'}} setup={setupOnce} shutdown={shutdownOnce}>
      <Card.Body style={{ height: '100%', width: '100%', overflow: 'hidden', display: 'block'}}>
        <Card.Title>View: {path}</Card.Title>
        <div id={containerId}></div>
      </Card.Body>
    </Card>
  );

  return viewer;
};

const downloadFile = async (path) => {
  const data = await readFile({ as: 'bytes' }, path);
  const blob = new Blob([data.buffer], { type: 'application/zip' });
  saveAs(blob, path.split('/').pop());
};

const newFile = async () => {
  const file = document.getElementById('project/new/name').value;
  if (file.length > 0) {
    // FIX: Prevent this from overwriting existing files.
    await writeFile({}, `file/${file}`, '').then(_ => _).catch(_ => _);
  }
};

const newProject = async () => {
  const filesystem = document.getElementById('projects/new/name').value;
  if (filesystem.length > 0) {
    // FIX: Prevent this from overwriting existing filesystems.
    setupFilesystem({ fileBase: filesystem });
    await writeFile({}, 'file/script.jsx', defaultScript);
    ui.dropKeys(['projects']);
    await displayProjects();
    await switchFilesystemview(filesystem);
  }
};

const exportProject = async (path) => {
  const file = document.getElementById('project/export/name').value;
  const data = await toZipFromFilesystem();
  const blob = new Blob([data.buffer], { type: 'application/zip' });
  saveAs(blob, getFilesystem());
};

const importProject = async (e) => {
  const file = document.getElementById('project/import').files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const zip = e.target.result;
    fromZipToFilesystem({}, zip)
      .then(_ => ui.dropKeys(['project']))
      .then(_ => displayProject());
  };
  reader.readAsArrayBuffer(file);
};

let ask;

const getAsk = async () => {
  if (ask === undefined) {
    const agent = async ({ ask, question }) => {
      if (question.readFile) {
        const { options, path } = question.readFile;
        return readFile(options, path);
      } else if (question.writeFile) {
        const { options, path, data } = question.writeFile;
        return writeFile(options, path, data);
      } else if (question.deleteFile) {
        const { options, path } = question.deleteFile;
        return deleteFile(options, path);
      } else if (question.log) {
        const { entry } = question.log;
        return log(entry);
      }
    };

    ({ ask } = await createService({ webWorker: './webworker.js', agent }));
  }

  return ask;
}

const runScript = async (path, ui) => {
  // await viewLog();
  const project = getFilesystem();
  await ui.addLayout({ x: 2, y: 5, w: 5, h: 3, i: `${project}:log` });
  const ask = await getAsk();
  const script = await readFile({}, `file/${path}`);
  const geometry = await ask({ evaluate: script });
  if (geometry) {
    await writeFile({}, 'file/preview', 'preview');
    await writeFile({}, 'geometry/preview', JSON.stringify(geometry));
  }
}

const editSvgPath = async (key, path) => {
  const data = await readFile({}, `file/${path}`);

  const save = async (svgpath) => writeFile({}, `file/${path}`, svgpath);

  const stop = (e) => e.stopPropagation();

  const editor = await (
    <Container key={key} style={{ height: '100%', display: 'flex', flexFlow: 'column', padding: '4px', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}>
      <Row style={{ flex: '0 0 auto' }}>
        <Col>
          <Card.Title>Edit SvgPath: {path}</Card.Title>
        </Col>
      </Row>
      <Row style={{ flex: '1 1 auto', overflow: 'auto' }}>
        <Col onMouseDown={stop} onMouseMove={stop} onMouseUp={stop}>
          <SvgPathEditor path={data} onsave={save}/>,
        </Col>
      </Row>
    </Container>
  );

  // ui.addItem(editor, { key, x: 2, width: 7, height: 5 });
  return editor;
};

const addFile = () => {
  const file = document.getElementById('fs/file/add').value;
  if (file.length > 0) {
    // FIX: Prevent this from overwriting existing files.
    writeFile({}, `file/${file}`, '').then(_ => _).catch(_ => _);
  }
};

const exportFilesystem = () => {
  toZipFromFilesystem()
      .then(data => new Blob([data.buffer], { type: 'application/zip' }))
      .then(blob => saveAs(blob, getFilesystem()));
};

const importFilesystem = (e) => {
  const file = document.getElementById('fs/filesystem/import').files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const zip = e.target.result;
    fromZipToFilesystem({}, zip).then(_ => _);
  };
  reader.readAsArrayBuffer(file);
};

const defaultScript = `// Circle(10);`;

const addFilesystem = () => {
  const filesystem = document.getElementById('fs/filesystem/add').value;
  if (filesystem.length > 0) {
    // FIX: Prevent this from overwriting existing filesystems.
    setupFilesystem({ fileBase: filesystem });
    writeFile({}, 'file/script.jsx', defaultScript)
        .then(_ => switchFilesystemview(filesystem))
        .catch(_ => _);
  }
};

const editFile = (file) => {
  displayTextEditor(file).then(_ => _).catch(_ => _);
};

export const installFilesystemview = async ({ document, project }) => {
  if (project !== '') {
    await setupFilesystem({ fileBase: project });
  }
  await installUI();
  // await displayProjects();
  // watchFileCreation(async () => { if (projectOpen) { ui.dropKeys(['project']); await displayProject(); } });
  // watchFileDeletion(async () => { if (projectOpen) { ui.dropKeys(['project']); await displayProject(); } });
};
