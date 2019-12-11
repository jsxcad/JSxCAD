/* global history, location, window */

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
  unwatchLog,
  watchFileCreation,
  watchFileDeletion,
  watchLog,
  writeFile
} from '@jsxcad/sys';

import {
  readProject as readProjectFromGithub,
  writeProject as writeProjectToGithub
} from './github';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FilesUi from './FilesUi';
import JsEditorUi from './JsEditorUi';
import LogUi from './LogUi';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ParametersUi from './ParametersUi';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Row from 'react-bootstrap/Row';
import SelectProjectUi from './SelectProjectUi';
import ShareUi from './ShareUi';
import Toast from 'react-bootstrap/Toast';
import ViewUi from './ViewUi';
import { deepEqual } from 'fast-equals';
import { writeProject as writeProjectToGist } from './gist';

class Ui extends React.PureComponent {
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
    this.doSelectProject = this.doSelectProject.bind(this);
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

    const { ask } = await createService({ webWorker: './webworker.js', agent, workerType: 'module' });
    this.setState({ ask, creationWatcher, deletionWatcher, logWatcher });
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

  async doGithub (options = {}) {
    const { action } = options;
    switch (action) {
      case 'gistExport': {
        const { gistIsPublic = true } = options;
        const project = getFilesystem();
        const url = await writeProjectToGist(project, { gistIsPublic });
        log({ op: 'text', text: `Created gist at ${url}`, level: 'serious' });
        return;
      }
      case 'githubRepositoryExport': {
        const { githubRepositoryOwner, githubRepositoryRepository, githubRepositoryPrefix } = options;
        const files = [];
        for (const file of await listFiles()) {
          if (file.startsWith('source/')) {
            files.push([file, await readFile({}, file)]);
          }
        }
        return writeProjectToGithub(githubRepositoryOwner, githubRepositoryRepository, githubRepositoryPrefix, files,
                                    { overwrite: false });
      }
      case 'githubRepositoryImport': {
        const { githubRepositoryOwner, githubRepositoryRepository, githubRepositoryPrefix } = options;
        return readProjectFromGithub(githubRepositoryOwner, githubRepositoryRepository, githubRepositoryPrefix,
                                     { overwrite: false });
      }
    }
  };

  async doSelectProject ({ project }) {
    return this.selectProject(project);
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
    const { ask } = this.state;
    const { view, file } = this.getPaneView(id);

    id = `${id}`;

    switch (view) {
      case 'geometry':
        return <ViewUi key={`${id}/geometry/${file}`} id={id} file={file}/>;
      case 'editScript':
        return <JsEditorUi key={`${id}/editScript/${file}`} id={id} file={file} ask={ask}/>;
      case 'files':
        return <FilesUi key={id} id={id}/>;
      case 'parameters': {
        const { parameters } = this.state;
        return <ParametersUi key={id} id={id} parameters={parameters} onChange={this.updateParameters}/>;
      }
      // case 'project':
      //  return <ProjectUi key={id} id={id} ui={this}/>;
      case 'log': {
        const { log } = this.state;
        return <LogUi key={id} id={id} log={log}/>;
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
      case 'io': {
        this.setState({ showShareUi: true });
        break;
      }
      case 'reference': {
        window.open(`https://github.com/jsxcad/JSxCAD/wiki/Reference`);
        break;
      }
      case 'selectProject': {
        this.setState({ showSelectProjectUi: true });
        break;
      }
    }
  }

  render () {
    const { project, files, toast } = this.state;
    const views = this.buildViews(files);

    const toasts = toast.map((entry, index) => {
      const { text, duration = 1000 } = entry;
      return <Toast key={`toast/${index}`}
        variant="info"
        delay={duration}
        show={true}
        autohide
        onClose={() => this.setState({ toast: toast.filter(item => item !== entry) })}>
        {text}
      </Toast>;
    });

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

    const { showShareUi = false, showSelectProjectUi = false } = this.state;
    const { projects = [] } = this.state;

    const buildModal = () => {
      if (showShareUi) {
        return <ShareUi
          key='shareUi'
          show={true}
          storage='share'
          toast={toastDiv}
          onSubmit={this.doGithub}
          onHide={() => this.setState({ showShareUi: false })}
        />;
      } else if (showSelectProjectUi || project === '') {
        return <SelectProjectUi
          key='selectProjectUi'
          show={true}
          projects={projects}
          storage='selectProject'
          toast={toastDiv}
          onSubmit={this.doSelectProject}
          onHide={() => this.setState({ showSelectProjectUi: false })}
        />;
      } else {
        return switchViewModal();
      }
    };

    const modal = buildModal();

    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', flexFlow: 'column' }}>
        {modal}
        {modal === undefined && toastDiv}
        <Navbar bg="light" expand="lg" style={{ flex: '0 0 auto' }}>
          <Navbar.Brand>JSxCAD</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto" onSelect={this.doNav}>
              <Nav.Item>
                <Nav.Link eventKey='selectProject'>
                  Project{project === '' ? '' : ` (${project})`}
                </Nav.Link>
              </Nav.Item>
              {(project !== '') && <Nav.Item><Nav.Link eventKey='io'>Share</Nav.Link></Nav.Item>}
              <Nav.Item><Nav.Link eventKey='reference'>Reference</Nav.Link></Nav.Item>
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

/*
class ProjectUi extends React.PureComponent {
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

const setupUi = async () => {
  const filesystems = await listFilesystems();
  const hash = location.hash.substring(1);
  const [encodedProject] = hash.split('@');
  const project = decodeURIComponent(encodedProject);
  ReactDOM.render(
    <Ui projects={[...filesystems]}
      project={project}
      width="100%"
      height="100%"
      cols={24}
      rowHeight={30}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
    />,
    document.getElementById('top'));
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
