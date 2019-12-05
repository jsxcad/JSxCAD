/* global Blob, FileReader, ResizeObserver, history, location, window */

import {
  Mosaic,
  RemoveButton as MosaicRemoveButton,
  SplitButton as MosaicSplitButton,
  MosaicWindow,
  MosaicZeroState
} from 'react-mosaic-component';

import {
  ask as askSys,
  createService,
  deleteFile,
  getFilesystem,
  listFiles,
  listFilesystems,
  log,
  readFile,
  setHandleAskUser,
  setupFilesystem,
  unwatchFileCreation,
  unwatchFileDeletion,
  unwatchFiles,
  unwatchLog,
  watchFile,
  watchFileCreation,
  watchFileDeletion,
  watchLog,
  writeFile
} from '@jsxcad/sys';

import { buildGui, buildGuiControls, buildMeshes, buildScene, buildTrackballControls, createResizer, drawHud } from '@jsxcad/ui-threejs';

// import { fromZipToFilesystem, toZipFromFilesystem } from '@jsxcad/convert-zip';

import {
  readProject as readProjectFromGithub,
  writeProject as writeProjectToGithub
} from './github';

import AceEditor from 'react-ace';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import PrismJS from 'prismjs/components/prism-core';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import { aceEditorAuxiliary } from './AceEditorAuxiliary';
import { deepEqual } from 'fast-equals';
import { prismJSAuxiliary } from './PrismJSAuxiliary';
import saveAs from 'file-saver';
import { toThreejsGeometry } from '@jsxcad/convert-threejs';

if (!aceEditorAuxiliary || !prismJSAuxiliary) {
  throw Error('die');
}

class UI extends React.PureComponent {
  static get propTypes () {
    return {
      project: PropTypes.string,
      projects: PropTypes.array
    };
  }

  constructor (props) {
    super(props);

    this.state = {
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
      toast: []
    };

    this.askUser = this.askUser.bind(this);
    this.addProject = this.addProject.bind(this);
    this.createNode = this.createNode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onRelease = this.onRelease.bind(this);
    this.openLog = this.openLog.bind(this);
    this.openParameters = this.openParameters.bind(this);
    this.updateParameters = this.updateParameters.bind(this);
    this.doGithub = this.doGithub.bind(this);
    this.doNav = this.doNav.bind(this);

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

    const logUpdater = (entry) => {
      const { op } = entry;
      switch (op) {
        case 'clear':
          this.setState({ log: [] });
          return;
        case 'open':
          return;
        default: {
          const { log, toast } = this.state;
          this.setState({
            log: [...log, entry],
            toast: [...toast, entry].filter(entry => entry.op === 'text' && entry.level === 'serious')
          });
        }
      }
    };
    const logWatcher = watchLog(logUpdater);
    this.setState({ creationWatcher, deletionWatcher, logWatcher });
    setHandleAskUser(this.askUser);

    if (project) {
      await this.selectProject(project);
    }
  }

  async componentWillUnmount () {
    const { creationWatcher, deletionWatcher, logWatcher } = this.state;

    await unwatchFileCreation(creationWatcher);
    await unwatchFileDeletion(deletionWatcher);
    await unwatchLog(logWatcher);
  }

  async askUser (identifier, options) {
    const { parameters } = this.state;

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
      await writeFile({}, 'source/script.jsxcad', defaultScript);
      await writeFile({}, 'ui/paneLayout', JSON.stringify(defaultPaneLayout));
      await writeFile({}, 'ui/paneViews', JSON.stringify(defaultPaneViews));
      await this.selectProject(project);
    }
  };

  async selectProject (project) {
    setupFilesystem({ fileBase: project });
    const encodedProject = encodeURIComponent(project);
    history.pushState(null, null, `#${encodedProject}`);
    const paneLayoutData = await readFile({}, 'ui/paneLayout');
    let paneLayout;
    if (paneLayoutData !== undefined && paneLayoutData !== 'null') {
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
    this.setState({ paneLayout, paneViews, project, files });
    this.switchingProjects = false;
  };

  closeProject () {
    this.setState({ project: '' });
  }

  async doGithub (action, owner, repository, prefix) {
    switch (action) {
      case 'export': {
        const files = [];
        for (const file of await listFiles()) {
          if (file.startsWith('source/')) {
            files.push([file, await readFile({}, file)]);
          }
        }
        return writeProjectToGithub(owner, repository, prefix, files, { overwrite: false });
      }
      case 'import': {
        return readProjectFromGithub(owner, repository, prefix, { overwrite: false });
      }
    }
  };

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
    };

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
      if (file.startsWith('source/') && (file.endsWith('.jsxcad') || file.endsWith('.jsx'))) {
        views.push({ view: 'editScript', file, title: `Edit ${file.substring(7)}` });
      }
      if (file.startsWith('source/') && (file.endsWith('.svp') || file.endsWith('.svgpath'))) {
        views.push({ view: 'editSvgPath', file, title: `Edit ${file.substring(7)}` });
      }
    }

    views.push({ view: 'files', title: 'Files' });
    views.push({ view: 'log', title: 'Log' });
    views.push({ view: 'parameters', title: 'Parameters' });
    // views.push({ view: 'project', title: 'Project' });

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
    const { paneViews } = this.state;
    const newPaneViews = [];
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
        return <ParametersUI key={id} id={id} parameters={parameters} onChange={this.updateParameters}/>;
      }
      // case 'project':
      //  return <ProjectUI key={id} id={id} ui={this}/>;
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

  doNav (to) {
    switch (to) {
      case 'project/github': {
        this.setState({ showGithubUi: true });
      }
    }
  }

  render () {
    const { project, files, toast } = this.state;
    const views = this.buildViews(files);

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
        style={{ position: 'absolute', zIndex: 1000, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        {toasts}
      </Alert>
      : [];

    const buildButtons = (id) => {
      return (
        <Button key="actions"
          size="sm"
          variant="outline-info"
          onClick={() => this.setState({ switchView: id })}>
          Switch
        </Button>
      );
    };

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

    const { showGithubUi = false } = this.state;

    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', flexFlow: 'column' }}>
        <GithubUI
          key='GithubUI'
          show={showGithubUi}
          storage='github'
          onSubmit={({ action, owner, repository, prefix }) => {
            this.doGithub(action, owner, repository, prefix);
          }}
          onHide={() => this.setState({ showGithubUi: false })}
        />
        {switchViewModal()}
        {toastDiv}
        <Navbar bg="light" expand="lg" style={{ flex: '0 0 auto' }}>
          <Navbar.Brand>JSxCAD preAlpha3</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown title={project === '' ? 'Select Project' : `Project ${project}` }>
                <InputGroup>
                  <FormControl id="project/add/name" placeholder="Project Name" />
                  <InputGroup.Append>
                    <Button onClick={this.addProject} variant='outline-primary'>Add Project</Button>
                  </InputGroup.Append>
                </InputGroup>
                {this.state
                    .projects
                    .map((project, index) =>
                      <NavDropdown.Item
                        key={index}
                        variant="outline-primary"
                        style={{ textAlign: 'left' }}
                        onClick={() => this.selectProject(project)}
                      >
                        {project}
                      </NavDropdown.Item>)}
              </NavDropdown>
              {
                (project !== '') &&
                <NavDropdown title="Project" onSelect={this.doNav}>
                  <NavDropdown.Item eventKey="project/github">Github</NavDropdown.Item>
                </NavDropdown>
              }
              <NavDropdown title="Reference">
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Mosaic
          style={{ flex: '1 1 auto', background: '#e6ebf0' }}
          key={`mosaic/${project}`}
          renderTile={(id, path) => (
            <MosaicWindow
              key={`window/${project}/${id}`}
              createNode={this.createNode}
              title={this.getPaneView(id).title}
              toolbarControls={[<ButtonGroup key="switch">{ buildButtons(id) }</ButtonGroup>,
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

class SettingsUI extends React.PureComponent {
  static get propTypes () {
    return {
      onHide: PropTypes.func,
      onSubmit: PropTypes.func,
      storage: PropTypes.string
    };
  }

  constructor (props) {
    super(props);
    this.doHide = this.doHide.bind(this);
    this.doSubmit = this.doSubmit.bind(this);
    this.doUpdate = this.doUpdate.bind(this);
    this.state = {};
  }

  async componentDidMount () {
    const { storage } = this.props;
    const state = await readFile({}, `settings/${storage}`);
    if (state !== undefined) {
      this.setState(JSON.parse(state));
    }
  }

  doHide (event) {
    const { onHide } = this.props;
    if (onHide) {
      onHide(this.state);
    }
  }

  async doSubmit (event, payload) {
    this.setState(payload);
    const { onSubmit, storage } = this.props;
    if (storage) {
      await writeFile({}, `settings/${storage}`, JSON.stringify(this.state));
    }
    if (onSubmit) {
      onSubmit(this.state);
    }
    this.doHide();
    event.preventDefault();
  }

  doUpdate (event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }
}

class GithubUI extends SettingsUI {
  constructor (props) {
    super(props);
    this.state = {
      owner: '',
      repository: '',
      prefix: `jsxcad/${getFilesystem()}/`
    };
  }

  render () {
    const { owner, repository, prefix } = this.state;
    return (
      <Modal show={this.props.show} onHide={this.doHide}>
        <Modal.Header closeButton>
          <Modal.Title>Github Actions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Owner</Form.Label>
              <Form.Control name="owner" value={owner} onChange={this.doUpdate}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Repository</Form.Label>
              <Form.Control name="repository" value={repository} onChange={this.doUpdate}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Path Prefix</Form.Label>
              <Form.Control name="prefix" value={prefix} onChange={this.doUpdate}/>
            </Form.Group>
            <ButtonGroup>
              <Button name="import" variant="outline-primary" onClick={(e) => this.doSubmit(e, { action: 'import' })}>
                Import
              </Button>
              <Button name="export" variant="outline-primary" onClick={(e) => this.doSubmit(e, { action: 'export' })}>
                Export
              </Button>
            </ButtonGroup>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

class ParametersUI extends React.PureComponent {
  static get propTypes () {
    return {
      id: PropTypes.string,
      onChange: PropTypes.func,
      parameters: PropTypes.array,
      project: PropTypes.string
    };
  }

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
    const { identifier, prompt, value = '', options = {} } = parameter;
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
              {choices.map((choice, index) => <option key={index}>{choice}</option>)}
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
      <Container
        key={id}
        style={{
          height: '100%',
          display: 'flex',
          flexFlow: 'column',
          padding: '4px',
          border: '1px solid rgba(0,0,0,.125)',
          borderRadius: '.25rem'
        }}
      >
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

/*
class ProjectUI extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      doShowDeleteProject: false,
      project: ''
    };

    this.copyProject = this.copyProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.exportProject = this.exportProject.bind(this);
    this.exportProjectToGist = this.exportProjectToGist.bind(this);
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

  async exportProjectToGist () {
    const CREATED = 201;

    let oldToken;
    for (let attempt = 0; attempt < 60; attempt++) {
      console.log(`QQ/attempt: ${attempt}`);
      const name = document.getElementById('project/exportToGist/name').value;
      const token = await readFile({ project: '.system', useCache: false }, 'auth/gist/accessToken');
      console.log(`QQ/token: ${token}`);
      if (token === undefined || token !== oldToken) {
        oldToken = token;
        const scriptJsx = await readFile({}, 'source/script.jsx');
        const scriptJsxcad = await readFile({}, 'source/script.jsxcad');
        const fetch = {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'JSxCAD v0.0.79',
            'Authorization': `token ${token}`
          },
          body: JSON.stringify({
            description: name || getFilesystem(),
            public: true,
            files: { 'script.jsxcad': { content: scriptJsxcad || scriptJsx } }
          })
        };
        const response = await window.fetch('https://api.github.com/gists', fetch);
        console.log(`QQ/response/status: ${response.status}`);
        console.log(`QQ/response/body: ${JSON.stringify(await response.json())}`);
        if (response.status === CREATED) {
          await log({ op: 'text', text: `Gist created`, level: 'serious' });
          return;
        } else {
          await log({ op: 'text', text: `Gist export failed: ${response.status}`, level: 'serious' });
          await log({ op: 'text', text: `Re-Authenticating`, level: 'serious' });
          window.open(`http://167.99.163.104:3000/auth/gist?gistCallback=${window.location.href}`);
        }
      }
      // Wait for the token to update.
      await sleep(1000);
    }
    // Give up after a minute.
    await log({ op: 'text', text: `Gave up on Gist export`, level: 'serious' });
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
      <Container
          key={id}
          style={{
                   height: '100%',
                   display: 'flex',
                   flexFlow: 'column',
                   padding: '4px',
                   border: '1px solid rgba(0,0,0,.125)', borderRadius: '.25rem'
                }}
          >
        <Row style={{ flex: '0 0 auto' }}>
          <Col>
            <InputGroup>
              <FormControl id="project/export/name" placeholder="Zip Name" />
              <InputGroup.Append>
                <Button onClick={this.exportProject} variant='outline-primary'>Export</Button>
              </InputGroup.Append>
            </InputGroup>
            <InputGroup>
              <FormControl id="project/exportToGist/name" placeholder="Gist Name" />
              <InputGroup.Append>
                <Button onClick={this.exportProjectToGist} variant='outline-primary'>Export</Button>
              </InputGroup.Append>
            </InputGroup>
            <InputGroup>
              <FormControl id="project/exportToGithubRepository/name" placeholder="Github Repository Name" />
              <InputGroup.Append>
                <Button onClick={this.exportProjectToGithubRepository} variant='outline-primary'>Export</Button>
              </InputGroup.Append>
            </InputGroup>
            <InputGroup>
              <FormControl
                  as="input"
                  type="file"
                  multiple={false}
                  id="project/import"
                  onChange={this.importProject}
                  style={{ display: 'none' }}
              />
              <FormControl disabled placeholder="" />
              <InputGroup.Append>
                <Button
                    onClick={this.clickImportProject}
                    id="project/import/button"
                    variant="outline-primary"
                    >
                  Import
                </Button>
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
                <Button
                    onClick={this.showDeleteProject}
                    id="project/delete/button"
                    variant="outline-primary"
                    >
                  Delete
                </Button>
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
*/

class FilesUI extends React.PureComponent {
  static get propTypes () {
    return {
      id: PropTypes.string
    };
  }

  constructor (props) {
    super(props);

    this.state = {
      files: []
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
    const file = document.getElementById('source/add/name').value;
    if (file.length > 0) {
      // FIX: Prevent this from overwriting existing files.
      await writeFile({}, `source/${file}`, '');
    }
  };

  async importFile (e) {
    const { id } = this.props;

    const file = document.getElementById(`source/${id}/import`).files[0];
    const name = document.getElementById(`source/${id}/name`).value;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      writeFile({}, `source/${name}`, new Uint8Array(data));
    };
    reader.readAsArrayBuffer(file);
  };

  clickImportFile () {
    const { id } = this.props;

    document.getElementById(`source/${id}/import`).click();
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
      <Container
        key={id}
        style={{
          height: '100%',
          display: 'flex',
          flexFlow: 'column',
          padding: '4px',
          border: '1px solid rgba(0,0,0,.125)',
          borderRadius: '.25rem'
        }}
      >
        <Row style={{ flex: '1 1 auto', overflow: 'auto' }}>
          <Col>
            <InputGroup>
              <FormControl id="source/add/name" placeholder="File Name" />
              <InputGroup.Append>
                <Button onClick={this.addFile} variant='outline-primary'>Add</Button>
              </InputGroup.Append>
            </InputGroup>
            <InputGroup>
              <FormControl
                as="input"
                type="file"
                id={`source/${id}/import`}
                multiple={false}
                onChange={this.importFile}
                style={{ display: 'none' }}
              />
              <FormControl id={`source/${id}/name`} placeholder="" />
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

class JSEditorUI extends React.PureComponent {
  static get propTypes () {
    return {
      file: PropTypes.string,
      id: PropTypes.string
    };
  }

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
      name: 'save',
      bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
      exec: () => this.save()
    };
  }

  runShortcut () {
    return {
      name: 'run',
      bindKey: { win: 'Shift-Enter', mac: 'Shift-Enter' },
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

  render () {
    const { id } = this.props;
    const { code } = this.state;

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
  static get propTypes () {
    return {
      id: PropTypes.string,
      log: PropTypes.array
    };
  }

  constructor (props) {
    super(props);

    this.state = {};
  }

  render () {
    const { id } = this.props;
    return (
      <Container key={id}
        style={{ height: '100%',
                 display: 'flex',
                 flexFlow: 'column',
                 padding: '4px',
                 border: '1px solid rgba(0,0,0,.125)',
                 borderRadius: '.25rem' }}>
        <Row style={{ flex: '1 1 auto', height: '100%', overflow: 'auto' }}>
          <Col>
            {this.props.log.filter(entry => entry.op === 'text')
                .map((entry, index) =>
                  <div
                    key={index}
                    style={{
                      padding: '4px',
                      border: '1px solid rgba(0,0,0,.125)',
                      borderRadius: '.25rem'
                    }}
                  >
                    {entry.text}
                  </div>
                )}
          </Col>
        </Row>
      </Container>
    );
  }
}

const setupUi = async () => {
  const filesystems = await listFilesystems();
  const hash = location.hash.substring(1);
  const [encodedProject] = hash.split('@');
  const project = decodeURIComponent(encodedProject);
  ReactDOM.render(
    <UI projects={[...filesystems]}
      project={project}
      width="100%"
      height="100%"
      cols={24}
      rowHeight={30}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
    />,
    document.getElementById('top'));
};

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

    ({ ask } = await createService({ webWorker: './webworker.js', agent, workerType: 'module' }));
  }

  return ask;
};

const runScript = async (path) => {
  log({ op: 'open' });
  const ask = await getAsk();
  const script = await readFile({}, path);
  const geometry = await ask({ evaluate: script });
  if (geometry) {
    await writeFile({}, 'geometry/preview', JSON.stringify(geometry));
  }
};

const defaultScript = `// Circle(10);`;

const defaultPaneLayout =
  {
    direction: 'row',
    first: '0',
    second: {
      direction: 'column',
      first: '2',
      second: '3',
      splitPercentage: 75
    }
  };

const defaultPaneViews = [
  ['0', {
    view: 'editScript',
    file: 'source/script.jsxcad',
    title: 'Edit script.jsxcad'
  }],
  ['1', {
    view: 'geometry',
    file: 'geometry/preview',
    title: 'View preview'
  }],
  ['2', {
    view: 'geometry',
    file: 'geometry/preview',
    title: 'View preview'
  }],
  ['3', {
    view: 'log',
    title: 'Log'
  }]
];

export const installUi = async ({ document, project }) => {
  if (project !== '') {
    await setupFilesystem({ fileBase: project });
  }
  await setupUi();
};
