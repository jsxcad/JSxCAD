/* global Blob, FileReader, ResizeObserver */

Error.stackTraceLimit = Infinity;

import { deepEqual } from 'fast-equals';
import { buildGui, buildGuiControls, buildTrackballControls } from '@jsxcad/convert-threejs/controls';
import { buildMeshes, drawHud } from '@jsxcad/convert-threejs/mesh';
import { buildScene, createResizer } from '@jsxcad/convert-threejs/scene';
import { ask as askSys, createService, deleteFile, getFilesystem, listFiles, listFilesystems, log, readFile, setHandleAskUser, setupFilesystem, unwatchFile, unwatchFileCreation, unwatchFileDeletion, unwatchLog, watchFile, watchLog, watchFileCreation, watchFileDeletion, writeFile } from '@jsxcad/sys';
import { fromZipToFilesystem, toZipFromFilesystem } from '@jsxcad/convert-zip';

import React from 'react';
import ReactDOM from 'react-dom';
import SvgPathEditor from './SvgPathEditor';
import saveAs from 'file-saver';
import { toThreejsGeometry } from '@jsxcad/convert-threejs';

import PrismJS from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import SplitButton from 'react-bootstrap/SplitButton';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Toast from 'react-bootstrap/Toast';

import { Mosaic, MosaicWindow, MosaicZeroState, RemoveButton as MosaicRemoveButton, SplitButton as MosaicSplitButton } from 'react-mosaic-component';

import Drawer from 'rc-drawer';

class UI extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      atLeft: false,
      isLogOpen: false,
      isParametersOpen: false,
      log: [],
      parameters: [],
      projects: this.props.projects,
      layout: [],
      panes: [],
      project: this.props.project,
      files: [],
      build: 0,
      paneLayout: '0',
      paneViews: [],
      toast: [],
    };

    this.askUser = this.askUser.bind(this);
    this.addProject = this.addProject.bind(this);
    this.createNode = this.createNode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onRelease = this.onRelease.bind(this);
    this.openLog = this.openLog.bind(this);
    this.openParameters = this.openParameters.bind(this);
    this.updateParameters = this.updateParameters.bind(this);

    this.switchingProjects = false;
  }

  async componentDidMount () {
    const { project } = this.state;

    const fileUpdater = async () => this.setState({
                                                     projects: await listFilesystems(),
                                                     files: await listFiles()
                                                  });
    const creationWatcher = await watchFileCreation(fileUpdater);
    const deletionWatcher = await watchFileDeletion(fileUpdater);

    const mouseWatcher = (event) => {
                           const { atLeft } = this.state;
                           if (event.pageX <= 5) {
                             this.setState({ atLeft: true });
                           } else if (event.pageX > 400 && atLeft) {
                             this.setState({ atLeft: false });
                           }
                         }

    document.addEventListener('mousemove', mouseWatcher, false);
    document.addEventListener('mouseenter', mouseWatcher, false);

    const logUpdater = (entry) => {
      const { op, status } = entry;
      switch (op) {
        case 'clear':
          this.setState({ log: [] });
          return;
        case 'open':
          // this.openLog();
          return;
        default: {
          const { log, toast } = this.state;
          this.setState({
            log: [...log, entry],
            toast: [...toast, entry].filter(entry => entry.op === 'text' && entry.level === 'serious')
          });
          return;
        }
      }
    }
    const logWatcher = watchLog(logUpdater);
    this.setState({ creationWatcher, deletionWatcher, mouseWatcher });
    setHandleAskUser(this.askUser);

    if (project) {
      await this.selectProject(project);
    }
  }

  async componentWillUnmount () {
    const { creationWatcher, deletionWatcher, mouseWatcher } = this.state;

    await unwatchFileCreation(creationWatcher);
    await unwatchFileDeletion(deletionWatcher);

    document.removeEventListener('mousemove', mouseWatcher);
    document.removeEventListener('mouseenter', mouseWatcher);
  }

  async askUser (identifier, options) {
    const { panes, parameters, project } = this.state;

    for (const parameter of parameters) {
      if (parameter.identifier === identifier) {
        return parameter.value;
      }
    }

    let { choices, initially } = options;

    if (initially === undefined && choices.length > 0) {
      initially = choices[0];
    }

    this.setState({
      parameters: [...parameters, { identifier, options, value: initially }]
    });

    return initially;
  }

  updateParameters (parameters) {
    this.setState({ parameters });
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
    const paneLayoutData = await readFile({}, 'ui/paneLayout');
    let paneLayout;
    if (paneLayoutData !== undefined && paneLayoutData !== "null") {
      paneLayout = JSON.parse(paneLayoutData);
    } else {
      paneLayout = '0';
    }

    const paneViewsData = await readFile({}, 'ui/paneViews');
    let paneViews;
    if (paneViewsData !== undefined) {
      paneViews = JSON.parse(paneViewsData);
    } else {
      paneViews = [];
    }

    this.switchingProjects = true;
    const files = [...await listFiles()];
    this.setState({ paneLayout, paneViews, project, files: [...await listFiles()] });
    this.switchingProjects = false;
  };

  closeProject () {
    this.setState({ project: '' });
  }

  createNode () {
    const { paneLayout } = this.state;

    const ids = new Set();

    const walk = (node) => {
      if (node === undefined) {
        return;
      }

      if (typeof node === 'string') {
        ids.add(node);
        return;
      }

      walk(node.first);
      walk(node.second);
    }

    walk(paneLayout);

    for (let n = 0; ; n++) {
      const id = `${n}`;
      if (!ids.has(id)) {
        return id;
      }
    }
  }

  async onChange (paneLayout) {
    if (paneLayout === null) {
      paneLayout = '0';
    }
    this.setState({ paneLayout });
    console.log(`QQ/onChange/paneLayout: ${JSON.stringify(paneLayout)}`);
    await writeFile({}, 'ui/paneLayout', JSON.stringify(paneLayout));
  }

  onRelease (paneLayout) {
  }

  buildViews (files) {
    const views = [];

    for (const file of files) {
      if (file.startsWith('geometry/')) {
        views.push({ view: 'geometry', file, title: `View ${file.substring(9)}` });
      }
      if (file.startsWith('file/') && file.endsWith('.jsx')) {
        views.push({ view: 'editScript', file, title: `Edit ${file.substring(5)}` });
      }
      if (file.startsWith('file/') && file.endsWith('.svp')) {
        views.push({ view: 'editSvgPath', file, title: `Edit ${file.substring(5)}` });
      }
    }

    views.push({ view: 'files', title: 'Files' });
    views.push({ view: 'log', title: 'Log' });
    views.push({ view: 'parameters', title: 'Parameters' });
    views.push({ view: 'project', title: 'Project' });

    return views;
  }

  getPaneView (queryId) {
    const { paneViews } = this.state;

    for (const [id, view] of paneViews) {
      if (id === queryId) {
        return view;
      }
    }

    return {};
  }

  async setPaneView (queryId, newView) {
    console.log(`QQ/setPaneView/queryId: ${queryId}`);
    console.log(`QQ/setPaneView/newView: ${newView}`);
    const { paneViews } = this.state;
    const newPaneViews = []
    let found = false;

    for (const [paneId, view] of paneViews) {
      if (paneId === queryId) {
        newPaneViews.push([paneId, newView]);
        found = true;
      } else {
        newPaneViews.push([paneId, view]);
      }
    }

    if (!found) {
      newPaneViews.push([queryId, newView]);
    }

    this.setState({ paneViews: newPaneViews, switchView: undefined });

    await writeFile({}, 'ui/paneViews', JSON.stringify(newPaneViews));
  }

  renderView (id) {
    const { view, file } = this.getPaneView(id);

    switch (view) {
      case 'geometry':
        return <ViewUI key={`${id}/geometry/${file}`} id={id} file={file}/>;
      case 'editScript':
        return <JSEditorUI key={`${id}/editScript/${file}`} id={id} file={file}/>;
      case 'files':
        return <FilesUI key={id} id={id}/>;
      case 'parameters': {
        const { parameters } = this.state;
        return <ParametersUI key={id} id={id} parameters={parameters} onChange={this.updateParameters}/>
      }
      case 'project':
        return <ProjectUI key={id} id={id} ui={this}/>;
      case 'log': {
        const { log } = this.state;
        return <LogUI key={id} id={id} log={log}/>;
      }
      default:
        return <div/>;
    }
  }

  openLog () {
    this.setState({ isLogOpen: true });
  }

  openParameters () {
    this.setState({ isParametersOpen: true });
  }

  render () {
    const { atLeft, ask, project, files, isLogOpen, isParametersOpen, log, parameters, toast } = this.state;
    const views = this.buildViews(files);
    const prefix = `${project}:`;

    const toasts = toast.map((entry, index) => 
                     <Toast key={`toast/${index}`}
                            variant="info"
                            delay={1000}
                            show={true}
                            autohide
                            onClose={() => this.setState({ toast: toast.filter(item => item !== entry) })}>
                       {entry.text}
                     </Toast>
                   );

    const toastDiv = toasts.length > 0
                     ? <Alert key="toasts"
                              variant="primary"
                              style={{ position: 'absolute', zIndex: 1000, top: 0, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                         {toasts}
                       </Alert>
                     : [];

    const drawerOpen = (project === '' || atLeft) ? true : undefined;

    const buildButtons = (id) => {
      return (
        <Button key="actions"
                size="sm"
                variant="outline-info"
                onClick={() => this.setState({ switchView: id })}>
          Switch
        </Button>
      );
    }

    const switchViewModal = () => {
      const { switchView } = this.state;

      if (switchView === undefined) {
        return;
      }

      const paneView = this.getPaneView(switchView);

      return (
        <Container>
          <Row>
            <Col>
              <Modal show={switchView !== undefined}
                     onHide={() => this.setState({ switchView: undefined })}
                     keyboard>
                <Modal.Header closeButton>
                  <Modal.Title>
                    Select Content
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <ButtonGroup vertical style={{ width: '100%' }}>
                    {views.map((viewOption, index) =>
                               <Button key={`switch/${index}`}
                                       variant='outline-primary'
                                       active={deepEqual(paneView, viewOption)}
                                       onClick={() => this.setPaneView(switchView, viewOption)}>
                                 {viewOption.title}
                               </Button>) }
                  </ButtonGroup>
                </Modal.Body>
              </Modal>
            </Col>
          </Row>
        </Container>
      );
    };

    return (
      <div>
        {switchViewModal()}
        {toastDiv}
        <Drawer key={`drawer/${project}`} width="400px" placement="left" handler={false} open={drawerOpen} defaultOpen={drawerOpen}>
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
                      <Button key={index} variant="outline-primary" style={{ textAlign: 'left' }} onClick={() => this.selectProject(project)}>
                        {project}
                      </Button>)}
          </ButtonGroup>
        </Drawer>
        <Mosaic
          key={`mosaic/${project}`}
          renderTile={(id, path) => (
                       <MosaicWindow
                         key={`window/${project}/${id}`}
                         createNode={this.createNode}
                         title={this.getPaneView(id).title}
                         toolbarControls={[<ButtonGroup>{ buildButtons(id) }</ButtonGroup>,
                                           <MosaicSplitButton key="split" />,
                                           <MosaicRemoveButton key="remove"/>]}
                         path={path}>
                         {this.renderView(id)}
                       </MosaicWindow>
                     )}
          zeroStateView={<MosaicZeroState createNode={this.createNode}/>}
          value={this.state.paneLayout}
          onChange={this.onChange}
          onRelease={this.onRelease}
          className={''}>
        </Mosaic>
      </div>
    );
  }
};

class ParametersUI extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {};

    this.renderParameter = this.renderParameter.bind(this);
    this.updateParameterValue = this.updateParameterValue.bind(this);
  }

  updateParameterValue (newParameter, event) {
    const { onChange, parameters } = this.props;
    const value = (event.target.checked === undefined)
                  ? event.target.value
                  : event.target.checked;

    const updated = [];

    for (const oldParameter of parameters) {
      if (oldParameter.identifier === newParameter.identifier) {
        updated.push({ ...oldParameter, value });
      } else {
        updated.push(oldParameter);
      }
    }

    if (onChange) {
      onChange(updated);
    }
  }

  renderParameter (parameter) {
    const { identifier, prompt, value = '', options = {}} = parameter;
    const { choices } = options;
    const { project } = this.props;
    const label = (prompt || identifier);
    const id = `parameter/${project}/${identifier}`;

    const onChange = (event) => this.updateParameterValue(parameter, event);

    if (choices !== undefined) {
      if (choices.every(choice => [true, false].includes(choice))) {
        return (
          <InputGroup key={id}>
            <Form.Check type="checkbox" key={id} label={label} onChange={onChange}/>
          </InputGroup>
        );
      } else {
        return (
          <InputGroup key={id}>
            <InputGroup.Prepend>
              <InputGroup.Text>{label}</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl key={id} as="select" defaultValue={choices[0]} onChange={onChange}>
            {choices.map((choice, index) => <option>{choice}</option>)}
            </FormControl>
          </InputGroup>
        );
      }
    } else {
      return (
        <InputGroup key={id}>
          <InputGroup.Prepend>
            <InputGroup.Text>{label}</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl key={id} id={id} defaultValue={value} onChange={onChange}/>
        </InputGroup>
      );
    }
  }

  render () {
    const { id, parameters } = this.props;

    return (
      <Container key={id} style={{ height: '100%', display: 'flex', flexFlow: 'column', padding: '4px', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}>
        <Row style={{ width: '100%', height: '100%', flex: '1 1 auto' }}>
          <Col>
            <InputGroup>
              {parameters.map(this.renderParameter)}
            </InputGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

class ProjectUI extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      doShowDeleteProject: false,
      project: '',
    };

    this.copyProject = this.copyProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.exportProject = this.exportProject.bind(this);
    this.hideDeleteProject = this.hideDeleteProject.bind(this);
    this.importProject = this.importProject.bind(this);
    this.showDeleteProject = this.showDeleteProject.bind(this);
  }

  async componentDidMount () {
    const project = getFilesystem();
    this.setState({ project });
  }

  stop (e) {
    e.stopPropagation();
  }

  clickImportProject () {
    document.getElementById('project/import').click();
  }

  async exportProject () {
    const zip = await toZipFromFilesystem();
    const blob = new Blob([zip.buffer], { type: 'application/zip' });
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

  async hideDeleteProject () {
    this.setState({ doShowDeleteProject: false });
  }

  async showDeleteProject () {
    this.setState({ doShowDeleteProject: true });
  }

  async deleteProject () {
    for (const file of await listFiles()) {
      await deleteFile({}, file);
    }
    this.props.ui.closeProject();
  }

  async copyProject () {
    const newProject = document.getElementById('project/copy/name').value;
    for (const file of await listFiles()) {
      const data = await readFile({ as: 'bytes' }, file);
      await writeFile({ as: 'bytes', project: newProject }, file, data);
    }
  }

  render () {
    const { id } = this.props;
    const { doShowDeleteProject, project } = this.state;

    return (
      <Container key={id} style={{ height: '100%', display: 'flex', flexFlow: 'column', padding: '4px', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}>
        <Row style={{ flex: '0 0 auto' }}>
          <Col>
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
              <FormControl id="project/copy/name" placeholder="New Project" />
              <InputGroup.Append>
                <Button onClick={this.copyProject} variant='outline-primary'>Copy</Button>
              </InputGroup.Append>
            </InputGroup>
            <InputGroup>
              <FormControl disabled placeholder="" />
              <InputGroup.Append>
                <Button onClick={this.showDeleteProject} id="project/delete/button" variant="outline-primary">Delete</Button>
              </InputGroup.Append>
            </InputGroup>
            <Modal show={doShowDeleteProject} onHide={this.hideDeleteProject}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm</Modal.Title>
              </Modal.Header>
              <Modal.Body>Delete the {project} project?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.deleteProject}>
                  Delete
                </Button>
                <Button variant="primary" onClick={this.hideDeleteProject}>
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
    );
  }
};

class FilesUI extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      files: [],
    };

    this.addFile = this.addFile.bind(this);
    this.clickImportFile = this.clickImportFile.bind(this);
    this.importFile = this.importFile.bind(this);
  }

  async componentDidMount () {
    const files = await listFiles();
    const fileUpdater = async () => this.setState({ files: await listFiles() });
    const creationWatcher = await watchFileCreation(fileUpdater);
    const deletionWatcher = await watchFileDeletion(fileUpdater);
    this.setState({ files, creationWatcher, deletionWatcher });
  }

  async componentWillUnmount () {
    const { creationWatcher, deletionWatcher } = this.state;

    await unwatchFileCreation(creationWatcher);
    await unwatchFileDeletion(deletionWatcher);
  }

  async addFile () {
    const file = document.getElementById('file/add/name').value;
    if (file.length > 0) {
      // FIX: Prevent this from overwriting existing files.
      await writeFile({}, `file/${file}`, '');
    }
  };

  async importFile (e) {
    const { id } = this.props;

    const file = document.getElementById(`file/${id}/import`).files[0];
    const name = document.getElementById(`file/${id}/name`).value;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      writeFile({}, `file/${name}`, new Uint8Array(data));
    };
    reader.readAsArrayBuffer(file);
  };

  clickImportFile () {
    const { id } = this.props;

    document.getElementById(`file/${id}/import`).click();
  }

  buildFiles () {
    const { files } = this.state;
    return files.map(file =>
                       <InputGroup key={file}>
                         <FormControl disabled placeholder={file} />
                         <InputGroup.Append>
                           <Button onClick={() => deleteFile({}, file)} variant="outline-primary">Delete</Button>
                         </InputGroup.Append>
                       </InputGroup>
                     );
  }

  render () {
    const { id } = this.props;

    return (
      <Container key={id} style={{ height: '100%', display: 'flex', flexFlow: 'column', padding: '4px', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}>
        <Row style={{ flex: '1 1 auto', overflow: 'auto' }}>
          <Col>
            <InputGroup>
              <FormControl id="file/add/name" placeholder="File Name" />
              <InputGroup.Append>
                <Button onClick={this.addFile} variant='outline-primary'>Add</Button>
              </InputGroup.Append>
            </InputGroup>
            <InputGroup>
              <FormControl as="input" type="file" id={`file/${id}/import`} multiple={false} onChange={this.importFile} style={{ display: 'none' }} />
              <FormControl id={`file/${id}/name`} placeholder="" />
              <InputGroup.Append>
                <Button onClick={this.clickImportFile} variant="outline-primary">Import</Button>
              </InputGroup.Append>
            </InputGroup>
            {this.buildFiles()}
          </Col>
        </Row>
      </Container>
    );
  }
};

class ViewUI extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      file: props.file,
      containerId: `${props.id}/container/${props.file}`
    }
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
      await unwatchFile(watcher);
    }
  }

  render () {
    const { id } = this.props;
    const { file, containerId } = this.state;
    const filePath = `file/${file.substring(9)}`;

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

class JSEditorUI extends React.PureComponent {
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

  saveShortcut () {
    return {
             name: "save",
             bindKey: { win: "Ctrl-S", mac: "Command-S"},
             exec: () => this.save()
           };
  }

  runShortcut () {
    return {
             name: "run",
             bindKey: { win: "Shift-Enter", mac: "Shift-Enter"},
             exec: () => this.run()
           };
  }

  async run () {
    const { file } = this.props;

    await this.save();
    await runScript(file);
  }

  async save () {
    const { code } = this.state;
    await writeFile({}, this.props.file, code);
  }

  async componentDidMount () {
    const code = await readFile({}, this.props.file);
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
    const { id } = this.props;
    const { code } = this.state;

    //  <Container style={{ height: '100%', display: 'flex', flexFlow: 'column', padding: '4px', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}/>
    //      <Col style={{ width: '100%', height: '100%', overflow: 'auto' }} onKeyDown={this.onKeyDown}>

    return (
      <Container style={{ height: '100%', display: 'flex', flexFlow: 'column' }}>
        <Row style={{ width: '100%', height: '100%', flex: '1 1 auto' }}>
          <Col style={{ width: '100%', height: '100%', overflow: 'auto' }} onKeyDown={this.onKeyDown}>
            <AceEditor
               commands={[this.runShortcut(), this.saveShortcut()]}
               editorProps={{ $blockScrolling: true }}
               height='100%'
               highlightActiveLine={true}
               key={id}
               mode="javascript"
               name={id}
               onChange={this.onValueChange}
               showGutter={true}
               showPrintMargin={true}
               theme="github"
               value={code}
               width='100%'
               >
            </AceEditor>
          </Col>
        </Row>
        <Row style={{ flex: '0 0 auto' }}>
          <Col>
            <br/>
            <ButtonGroup>
              <Button size='sm'
                      onClick={this.run}
                      variant='outline-primary'>
                Run
              </Button>
              <Button size='sm'
                      onClick={this.save}
                      variant='outline-primary'>
                Save
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    );
  }
};

class LogUI extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {}
  }

  render () {
    const { id } = this.props;
    const { mode, viewerElementId } = this.state;

    return (
      <Container key={id}
                 style={{ height: '100%', display: 'flex', flexFlow: 'column',
                          padding: '4px', border: '1px solid rgba(0,0,0,.125)',
                          borderRadius: '.25rem' }}>
        <Row style={{ flex: '1 1 auto', height: '100%', overflow: 'auto' }}>
          <Col>
            {this.props.log.filter(entry => entry.op === 'text')
                           .map((entry, index) =>
                                  <div key={index} style={{ padding: '4px', border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem' }}>
                                    {entry.text}
                                  </div>
                                )}
          </Col>
        </Row>
      </Container>
    );
  }
}

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

const downloadFile = async (path) => {
  const data = await readFile({ as: 'bytes' }, path);
  const blob = new Blob([data.buffer], { type: 'application/octet-stream' });
  saveAs(blob, path.split('/').pop());
};

let ask;

const getAsk = async () => {
  if (ask === undefined) {
    const agent = async ({ ask, question }) => {
      if (question.ask) {
        const { identifier, options } = question.ask;
        return askSys(identifier, options);
      } else if (question.readFile) {
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

const runScript = async (path) => {
  log({ op: 'open' });
  const project = getFilesystem();
  const ask = await getAsk();
  const script = await readFile({}, path);
  const geometry = await ask({ evaluate: script });
  if (geometry) {
    await writeFile({}, 'geometry/preview', JSON.stringify(geometry));
  }
}

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
};
