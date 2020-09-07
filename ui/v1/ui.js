/* global history, location */

import SplitPane, { Pane } from 'react-split-pane';

import {
  askService,
  ask as askSys,
  boot,
  clearEmitted,
  deleteFile,
  emit,
  getCurrentPath,
  getEmitted,
  listFiles,
  listFilesystems,
  log,
  read,
  resolvePending,
  setupFilesystem,
  terminateActiveServices,
  touch,
  unwatchFileCreation,
  unwatchFileDeletion,
  watchFileCreation,
  watchFileDeletion,
  write,
} from '@jsxcad/sys';

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import JsEditorUi from './JsEditorUi';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NotebookUi from './NotebookUi';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Spinner from 'react-bootstrap/Spinner';
import { getNotebookControlData } from '@jsxcad/ui-notebook';
import { toEcmascript } from '@jsxcad/compiler';

const ensureFile = async (file, url, { workspace } = {}) => {
  const sources = [];
  if (url !== undefined) {
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

const defaultPaneLayout = {
  direction: 'row',
  first: '0',
  second: { direction: 'column', first: '2', second: '3', splitPercentage: 75 },
};

const defaultPaneViews = [
  [
    '0',
    {
      view: 'editScript',
      file: 'source/script.jsxcad',
      title: 'Edit script.jsxcad',
    },
  ],
  ['2', { view: 'notebook', title: 'Notebook' }],
  ['3', { view: 'log', title: 'Log' }],
];

class Ui extends React.PureComponent {
  static get propTypes() {
    return {
      workspace: PropTypes.string,
      workspaces: PropTypes.array,
      sha: PropTypes.string,
      file: PropTypes.string,
      fileTitle: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      workspaces: this.props.workspaces,
      workspace: this.props.workspace,
      files: [],
    };

    this.onRun = this.onRun.bind(this);
  }

  async componentDidMount() {
    const { workspace } = this.state;
    const { file, fileTitle, sha } = this.props;

    if (file && fileTitle) {
      await ensureFile(file, fileTitle, { workspace });
    }

    const fileUpdater = async () =>
      this.setState({
        workspaces: await listFilesystems(),
        files: await listFiles(),
      });
    const creationWatcher = await watchFileCreation(fileUpdater);
    const deletionWatcher = await watchFileDeletion(fileUpdater);

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

    const serviceSpec = {
      webWorker: `./webworker.js#${sha}`,
      agent,
      workerType: 'module',
    };

    const ask = async (question) => askService(serviceSpec, question);

    this.setState({
      ask,
      creationWatcher,
      deletionWatcher,
      file,
      fileTitle,
      serviceSpec,
    });

    if (workspace) {
      await this.selectWorkspace(workspace);
    }
  }

  async componentWillUnmount() {
    const { creationWatcher, deletionWatcher } = this.state;

    await unwatchFileCreation(creationWatcher);
    await unwatchFileDeletion(deletionWatcher);
  }

  updateUrl({ workspace, fileTitle } = {}) {
    if (workspace === undefined) {
      workspace = this.state.workspace;
    }
    if (workspace === undefined) {
      workspace = '';
    }
    if (fileTitle === undefined) {
      fileTitle = this.state.fileTitle;
    }
    if (fileTitle !== undefined) {
      fileTitle = `@${fileTitle}`;
    }
    const encodedWorkspace = encodeURIComponent(workspace);
    history.pushState(null, null, `#${encodedWorkspace}${fileTitle}`);
  }

  async selectWorkspace(workspace) {
    setupFilesystem({ fileBase: workspace });
    this.updateUrl({ workspace });
    const paneLayoutData = await read('ui/paneLayout');
    let paneLayout;
    if (paneLayoutData !== undefined && paneLayoutData !== 'null') {
      if (paneLayoutData.buffer) {
        paneLayout = JSON.parse(new TextDecoder('utf8').decode(paneLayoutData));
      } else {
        paneLayout = paneLayoutData;
      }
    } else {
      paneLayout = defaultPaneLayout;
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
      paneViews = defaultPaneViews;
    }

    const files = [...(await listFiles())];
    this.setState({ paneLayout, paneViews, workspace, files });
  }

  async onRun() {
    this.setState({ running: true });
    const { ask, file, workspace } = this.state;
    await terminateActiveServices();
    clearEmitted();

    // FIX: This is a bit awkward.
    // The responsibility for updating the control values ought to be with what
    // renders the notebook.
    const notebookControlData = await getNotebookControlData();
    await write(`control/${getCurrentPath()}`, notebookControlData);

    await log({ op: 'open' });
    await log({ op: 'clear' });
    await log({ op: 'text', text: 'Running', level: 'serious' });
    let script = await read(file);
    if (script.buffer) {
      script = new TextDecoder('utf8').decode(script);
    }
    const topLevel = new Map();
    const ecmascript = await toEcmascript(script, { topLevel });
    emit({ md: `---` });
    emit({ md: `#### Dependency Tree` });
    const graph = [];
    for (const [id, { dependencies }] of topLevel.entries()) {
      for (const dependency of dependencies) {
        graph.push(`${dependency}(${dependency}  .) --> ${id}(${id}  .)`);
      }
    }
    emit({ md: `'''\ngraph TD\n${graph.join('\n')}\n'''` });
    emit({ md: `---` });
    emit({ md: `#### Programs` });
    for (const [id, { program }] of topLevel.entries()) {
      emit({ md: `##### ${id}` });
      emit({ md: `'''\n${program}\n'''\n` });
    }
    const notebook = await ask({ evaluate: ecmascript, workspace, path: file });

    const writeNotebook = async (path, notebook) => {
      await resolvePending();
      // Extend the notebook.
      notebook.push(...getEmitted());
      // Resolve any promises.
      for (const note of notebook) {
        if (note.download) {
          for (const entry of note.download.entries) {
            entry.data = await entry.data;
          }
        }
      }
      await write(`notebook/${path}`, notebook);
    };

    await writeNotebook(file, notebook);
    await log({ op: 'text', text: 'Finished', level: 'serious' });
    this.setState({ running: false });
  }

  render() {
    const {
      ask,
      file,
      fileTitle,
      files,
      mode = 'Notebook',
      running,
      workspace,
    } = this.state;
    const { sha } = this.props;

    const selectFileTitle = async (fileTitle) => {
      const file = `source/${fileTitle}`;
      await ensureFile(file, fileTitle, { workspace });
      this.updateUrl({ fileTitle });
      this.setState({ file, fileTitle });
    };

    const openFileTitle = async (e) => {
      if (e.key === 'Enter') {
        selectFileTitle(fileTitle);
      }
    };

    const fileChoices = [
      ...new Set(
        files
          .filter(
            (file) =>
              file.startsWith('source/') &&
              (file.endsWith('.js') || file.endsWith('.nb'))
          )
          .map((file) => file.substr(7))
          .filter((option) => option !== file)
      ),
    ];

    const navItems = [];
    const panes = [];

    navItems.push(
      <Nav.Item>
        <Form.Control
          as="select"
          onChange={(e) => this.setState({ mode: e.target.value })}
        >
          <option selected={mode === 'Notebook'}>Notebook</option>
          <option selected={mode === 'Files'}>Files</option>
        </Form.Control>
      </Nav.Item>
    );

    switch (mode) {
      case 'Notebook':
        navItems.push(
          <Nav.Item>
            <Dropdown as={ButtonGroup}>
              <Form.Control
                value={fileTitle}
                onKeyPress={openFileTitle}
                onChange={(e) => this.setState({ fileTitle: e.target.value })}
                style={{ width: '100%' }}
              />
              <Dropdown.Toggle
                split
                variant="outline-primary"
                id="file-selector"
              />
              <Dropdown.Menu>
                {fileChoices.map((file, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => selectFileTitle(file)}
                  >
                    {file}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Nav.Item>
        );
        if (file) {
          panes.push(
            <div>
              <SplitPane split="vertical" defaultSize={830}>
                <Pane>
                  <JsEditorUi
                    key={`editScript/${file}`}
                    onRun={this.onRun}
                    file={file}
                    ask={ask}
                    workspace={workspace}
                  />
                </Pane>
                <Pane>
                  <NotebookUi
                    key={`notebook/${file}`}
                    sha={sha}
                    onRun={this.onRun}
                    file={file}
                    workspace={workspace}
                  />
                </Pane>
              </SplitPane>
            </div>
          );
        }
        break;
      case 'Files':
        break;
    }
    navItems.push(
      <Nav class="mr-auto">
        <Nav.Item
          onClick={() =>
            window.open('https://github.com/jsxcad/JSxCAD/wiki/Reference')
          }
        >
          <Nav.Link>Help</Nav.Link>
        </Nav.Item>
      </Nav>
    );

    const spinner = running ? (
      <Spinner animation="border" role="status">
        <span className="sr-only">Running</span>
      </Spinner>
    ) : (
      <span></span>
    );

    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexFlow: 'column',
        }}
      >
        <Navbar bg="light" expand="lg" style={{ flex: '0 0 auto' }}>
          <Navbar.Brand>{workspace}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav className="mr-auto">{navItems}</Nav>
          </Navbar.Collapse>
          {spinner}
        </Navbar>
        {panes}
      </div>
    );
  }
}

const setupUi = async (sha) => {
  const filesystems = await listFilesystems();
  const hash = location.hash.substring(1);
  const [encodedWorkspace, encodedFile] = hash.split('@');
  const workspace = decodeURIComponent(encodedWorkspace) || 'JSxCAD';
  let fileTitle = encodedFile ? decodeURIComponent(encodedFile) : '';
  let file = fileTitle ? `source/${fileTitle}` : '';
  ReactDOM.render(
    <Ui
      workspaces={[...filesystems]}
      workspace={workspace}
      file={file}
      fileTitle={fileTitle}
      sha={sha}
      width="100%"
      height="100%"
      cols={24}
      rowHeight={30}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
    />,
    document.getElementById('top')
  );
};

export const installUi = async ({ document, workspace, sha }) => {
  await boot();
  if (workspace !== '') {
    await setupFilesystem({ fileBase: workspace });
  }
  await setupUi(sha);
};
