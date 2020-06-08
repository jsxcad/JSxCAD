/* global history, location, window */

import { Mosaic, MosaicZeroState } from 'react-mosaic-component';

import {
  ask as askSys,
  boot,
  createService,
  deleteFile,
  getFilesystem,
  listFiles,
  listFilesystems,
  log,
  read,
  setHandleAskUser,
  setupFilesystem,
  touch,
  unwatchFileCreation,
  unwatchFileDeletion,
  unwatchLog,
  watchFileCreation,
  watchFileDeletion,
  watchLog,
  write
} from '@jsxcad/sys';

import {
  readWorkspace as readWorkspaceFromGithub,
  writeWorkspace as writeWorkspaceToGithub
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
import NotebookUi from './NotebookUi';
import NothingUi from './NothingUi';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Row from 'react-bootstrap/Row';
import SelectWorkspaceUi from './SelectWorkspaceUi';
import ShareUi from './ShareUi';
import SvgPathEditor from './SvgPathEditor';
import Toast from 'react-bootstrap/Toast';
import { deepEqual } from 'fast-equals';
import { writeWorkspace as writeWorkspaceToGist } from './gist';

const ensureFile = async (file, url, { workspace } = {}) => {
  const sources = [];
  if (url !== undefined) {
    if (url.startsWith('https://github.com/')) {
      url = `https://raw.githubusercontent.com/${url.substr(19)}`;
      url = url.replace('/blob/', '/');
    }
    sources.push(url);
  }
  // Ensure the file exists.
  // TODO: Handle a transform from file to source so that things github can be used sensibly.
  const content = await read(`${file}`, { workspace, sources });
  if (content === undefined) {
    // If we couldn't find it, create it as an empty file.
    await write(`${file}`, '', { workspace });
  }
};

class Ui extends React.PureComponent {
  static get propTypes () {
    return {
      workspace: PropTypes.string,
      workspaces: PropTypes.array,
      sha: PropTypes.string
    };
  }

  constructor (props) {
    super(props);

    this.state = {
      isLogOpen: false,
      log: [],
      parameters: [],
      workspaces: this.props.workspaces,
      layout: [],
      panes: [],
      workspace: this.props.workspace,
      files: [],
      build: 0,
      paneLayout: '0',
      paneViews: [],
      toast: []
    };

    this.askUser = this.askUser.bind(this);
    this.addWorkspace = this.addWorkspace.bind(this);
    this.createNode = this.createNode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onRelease = this.onRelease.bind(this);
    this.openLog = this.openLog.bind(this);
    this.updateParameters = this.updateParameters.bind(this);
    this.doGithub = this.doGithub.bind(this);
    this.doSelectWorkspace = this.doSelectWorkspace.bind(this);
    this.doNav = this.doNav.bind(this);

    this.switchingWorkspaces = false;
  }

  async componentDidMount () {
    const { workspace } = this.state;
    const { sha } = this.props;

    const fileUpdater = async () => this.setState({
      workspaces: await listFilesystems(),
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
        return read(path, options);
      } else if (question.writeFile) {
        const { options, path, data } = question.writeFile;
        return write(path, data, options);
      } else if (question.deleteFile) {
        const { options, path } = question.deleteFile;
        return deleteFile(options, path);
      } else if (question.log) {
        const { entry } = question.log;
        return log(entry);
      } else if (question.touchFile) {
        const { path, workspace } = question.touchFile;
        return touch(path, { workspace });
      }
    };

    const { ask } = await createService({ webWorker: `./webworker.js#${sha}`, agent, workerType: 'module' });
    // const { ask } = await createService({ webWorker: './webworker.js', agent, workerType: 'module' });
    this.setState({ ask, creationWatcher, deletionWatcher, logWatcher });
    setHandleAskUser(this.askUser);

    if (workspace) {
      await this.selectWorkspace(workspace);
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

  async addWorkspace () {
    const workspace = document.getElementById('workspace/add/name').value;
    if (workspace.length > 0) {
      // FIX: Prevent this from overwriting existing filesystems.
      setupFilesystem({ fileBase: workspace });
      await write('source/script.jsxcad', defaultScript);
      await write('ui/paneLayout', defaultPaneLayout);
      await write('ui/paneViews', defaultPaneViews);
      await this.selectWorkspace(workspace);
    }
  };

  async selectWorkspace (workspace) {
    setupFilesystem({ fileBase: workspace });
    const encodedWorkspace = encodeURIComponent(workspace);
    history.pushState(null, null, `#${encodedWorkspace}`);
    const paneLayoutData = await read('ui/paneLayout');
    let paneLayout;
    if (paneLayoutData !== undefined && paneLayoutData !== 'null') {
      if (paneLayoutData.buffer) {
        paneLayout = JSON.parse(new TextDecoder('utf8').decode(paneLayoutData));
      } else {
        paneLayout = paneLayoutData;
      }
    } else {
      paneLayout = '0';
    }

    const paneViewsData = await read('ui/paneViews');
    let paneViews;
    if (paneViewsData !== undefined) {
      if (paneViewsData.buffer) {
        paneViews = JSON.parse(new TextDecoder('utf8').decode(paneViewsData));
      } else {
        paneViews = paneViewsData;
      }
    } else {
      paneViews = [];
    }

    this.switchingWorkspaces = true;
    const files = [...await listFiles()];
    this.setState({ paneLayout, paneViews, workspace, files });
    this.switchingWorkspaces = false;
  };

  closeWorkspace () {
    this.setState({ workspace: '' });
  }

  async doGithub (options = {}) {
    const { action } = options;
    switch (action) {
      case 'gistExport': {
        const { gistIsPublic = true } = options;
        const workspace = getFilesystem();
        const url = await writeWorkspaceToGist(workspace, { gistIsPublic });
        log({ op: 'text', text: `Created gist at ${url}`, level: 'serious' });
        return;
      }
      case 'githubRepositoryExport': {
        const { githubRepositoryOwner, githubRepositoryRepository, githubRepositoryPrefix } = options;
        const files = [];
        for (const file of await listFiles()) {
          if (file.startsWith('source/')) {
            files.push([file, await read(file)]);
          }
        }
        return writeWorkspaceToGithub(githubRepositoryOwner, githubRepositoryRepository, githubRepositoryPrefix, files,
                                      { overwrite: false });
      }
      case 'githubRepositoryImport': {
        const { githubRepositoryOwner, githubRepositoryRepository, githubRepositoryPrefix } = options;
        return readWorkspaceFromGithub(githubRepositoryOwner, githubRepositoryRepository, githubRepositoryPrefix,
                                       { overwrite: false });
      }
    }
  };

  async doSelectWorkspace ({ workspace }) {
    return this.selectWorkspace(workspace);
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
    await write('ui/paneLayout', paneLayout);
  }

  onRelease (paneLayout) {
  }

  buildViews (files) {
    const views = [];

    for (const file of files) {
      if (file.startsWith('source/') && (file.endsWith('.jsxcad') || file.endsWith('.jsx') || file.endsWith('.js'))) {
        views.push({ view: 'editScript', viewTitle: 'Edit Script', file, fileTitle: `${file.substring(7)}` });
        views.push({ view: 'notebook', viewTitle: 'Notebook', file, fileTitle: `${file.substring(7)}` });
      }
      if (file.startsWith('source/') && (file.endsWith('.svp') || file.endsWith('.svgpath'))) {
        views.push({ view: 'editSvgPath', viewTitle: 'Edit SVG Path', file, fileTitle: `${file.substring(7)}` });
      }
    }

    views.push({ view: 'files', viewTitle: 'Files' });
    views.push({ view: 'log', viewTitle: 'Log' });

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

    await write('ui/paneViews', newPaneViews);
  }

  renderPane (views, id, path, createNode, onSelectView, onSelectFile) {
    const { workspace } = this.state;
    const { view, file } = this.getPaneView(id);
    const fileChoices = views.filter(entry => entry.view === view && entry.file !== file);
    const seenViewChoices = new Set();
    const viewChoices = [];
    for (const entry of views.filter(entry => entry.view !== view)) {
      if (!seenViewChoices.has(entry.view)) {
        seenViewChoices.add(entry.view);
        viewChoices.push(entry);
      }
    }
    const { ask } = this.state;

    switch (view) {
      case 'notebook': {
        const fileTitle = file === undefined ? '' : file.substring('source/'.length);
        return (
          <NotebookUi
            key={`${id}/notebook/${file}`}
            id={id}
            path={path}
            createNode={createNode}
            view={view}
            viewChoices={viewChoices}
            viewTitle={'Notebook'}
            onSelectView={onSelectView}
            file={file}
            fileChoices={fileChoices}
            fileTitle={fileTitle}
            onSelectFile={onSelectFile}
            workspace={workspace}
          />);
      }
      case 'editScript': {
        const fileTitle = file === undefined ? '' : file.substring('source/'.length);
        return (
          <JsEditorUi
            key={`${id}/editScript/${file}`}
            id={id}
            path={path}
            createNode={createNode}
            view={view}
            viewChoices={viewChoices}
            viewTitle={'Edit Script'}
            onSelectView={onSelectView}
            file={file}
            fileChoices={fileChoices}
            fileTitle={fileTitle}
            onSelectFile={onSelectFile}
            ask={ask}
            workspace={workspace}
          />);
      }
      case 'editSvgPath': {
        const fileTitle = file === undefined ? '' : file.substring('source/'.length);
        return (
          <SvgPathEditor
            key={`${id}/editSvgPath/${file}`}
            id={id}
            path={path}
            createNode={createNode}
            view={view}
            viewChoices={viewChoices}
            viewTitle={'Edit SvgPath'}
            onSelectView={onSelectView}
            file={file}
            fileChoices={fileChoices}
            fileTitle={fileTitle}
            onSelectFile={onSelectFile}
          />);
      }
      case 'files':
        return (
          <FilesUi
            key={id}
            id={id}
            path={path}
            createNode={createNode}
            view={view}
            viewChoices={viewChoices}
            viewTitle={'Files'}
            onSelectView={onSelectView}
          />);
      case 'log': {
        const { log } = this.state;
        if (log !== undefined) {
          return (
            <LogUi
              key={id}
              id={id}
              path={path}
              createNode={createNode}
              view={view}
              viewChoices={viewChoices}
              viewTitle={'Log'}
              onSelectView={onSelectView}
              log={log}
            />);
        }
      }
    }
    return (
      <NothingUi
        id={id}
        path={path}
        createNode={createNode}
        view={'nothing'}
        viewChoices={viewChoices}
        viewTitle={'Nothing'}
        onSelectView={onSelectView}
      />);
  }

  openLog () {
    this.setState({ isLogOpen: true });
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
      case 'selectWorkspace': {
        this.setState({ showSelectWorkspaceUi: true });
        break;
      }
    }
  }

  render () {
    const { workspace, files, toast } = this.state;
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

    const { showShareUi = false, showSelectWorkspaceUi = false } = this.state;
    const { workspaces = [] } = this.state;

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
      } else if (showSelectWorkspaceUi || workspace === '') {
        return <SelectWorkspaceUi
          key='selectWorkspaceUi'
          show={true}
          workspaces={workspaces}
          storage='selectWorkspace'
          toast={toastDiv}
          onSubmit={this.doSelectWorkspace}
          onHide={() => this.setState({ showSelectWorkspaceUi: false })}
        />;
      } else {
        return switchViewModal();
      }
    };

    const modal = buildModal();

    const selectView = async (id, view) => {
      this.setPaneView(id, { ...this.getPaneView(id), view, file: undefined });
    };

    const selectFile = async (id, file, url) => {
      await ensureFile(file, url);
      this.setPaneView(id, { ...this.getPaneView(id), file });
    };

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
                <Nav.Link eventKey='selectWorkspace'>
                  Workspace{workspace === '' ? '' : ` (${workspace})`}
                </Nav.Link>
              </Nav.Item>
              {(workspace !== '') && <Nav.Item><Nav.Link eventKey='io'>Share</Nav.Link></Nav.Item>}
              <Nav.Item><Nav.Link eventKey='reference'>Reference</Nav.Link></Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Mosaic
          style={{ flex: '1 1 auto', background: '#e6ebf0' }}
          key={`mosaic/${workspace}`}
          renderTile={(id, path) => {
            const pane = this.renderPane(views, `${id}`, path, this.createNode, selectView, selectFile);
            return pane;
          }}
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

const setupUi = async (sha) => {
  const filesystems = await listFilesystems();
  const hash = location.hash.substring(1);
  const [encodedWorkspace, encodedPath] = hash.split('@');
  const workspace = decodeURIComponent(encodedWorkspace);
  let path;
  if (encodedPath !== undefined) {
    path = decodeURIComponent(encodedPath);
    await ensureFile(`source/${path}`, path, { workspace });
  }
  ReactDOM.render(
    <Ui workspaces={[...filesystems]}
      workspace={workspace}
      path={path}
      sha={sha}
      width="100%"
      height="100%"
      cols={24}
      rowHeight={30}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
    />,
    document.getElementById('top'));
};

const defaultScript = `// Circle(10).topView();`;

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
    view: 'notebook',
    title: 'Notebook'
  }],
  ['3', {
    view: 'log',
    title: 'Log'
  }]
];

export const installUi = async ({ document, workspace, sha }) => {
  await boot();
  if (workspace !== '') {
    await setupFilesystem({ fileBase: workspace });
  }
  await setupUi(sha);
};
