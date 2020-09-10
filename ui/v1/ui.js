/* global FileReader, btoa, history, location */

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

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import JsEditorUi from './JsEditorUi';
import Mermaid from 'mermaid';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NotebookUi from './NotebookUi';
import Prettier from 'prettier/standalone.js';
import PrettierParserBabel from 'prettier/parser-babel.js';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Spinner from 'react-bootstrap/Spinner';
import { getNotebookControlData } from '@jsxcad/ui-notebook';
import marked from 'marked';
import { toEcmascript } from '@jsxcad/compiler';

marked.use({
  renderer: {
    code(code, language) {
      if (code.match(/^sequenceDiagram/) || code.match(/^graph/)) {
        return '<div class="mermaid">' + code + '</div>';
      } else {
        return '<pre><code>' + code + '</code></pre>';
      }
    },
  },
});

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
      path: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      workspaces: this.props.workspaces,
      workspace: this.props.workspace,
      files: [],
    };

    this.onChangeJsEditor = this.onChangeJsEditor.bind(this);
    this.onClickEditorLink = this.onClickEditorLink.bind(this);
    this.doPublish = this.doPublish.bind(this);
    this.doReload = this.doReload.bind(this);
    this.doRun = this.doRun.bind(this);
    this.doSave = this.doSave.bind(this);
    this.doUnload = this.doUnload.bind(this);
    this.doUpload = this.doUpload.bind(this);
  }

  async componentDidMount() {
    const { workspace } = this.state;
    const { file, path, sha } = this.props;

    if (file && path) {
      await ensureFile(file, path, { workspace });
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
      path,
      serviceSpec,
    });

    if (workspace) {
      await this.selectWorkspace(workspace);
    }

    if (path) {
      await this.loadJsEditor(path);
    }
  }

  async componentWillUnmount() {
    const { creationWatcher, deletionWatcher } = this.state;

    await unwatchFileCreation(creationWatcher);
    await unwatchFileDeletion(deletionWatcher);
  }

  updateUrl({ workspace, path } = {}) {
    if (workspace === undefined) {
      workspace = this.state.workspace;
    }
    if (workspace === undefined) {
      workspace = '';
    }
    if (path === undefined) {
      path = this.state.path;
    }
    if (path !== undefined) {
      path = `@${path}`;
    }
    const encodedWorkspace = encodeURIComponent(workspace);
    history.pushState(null, null, `#${encodedWorkspace}${path}`);
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

  buildConfirm({
    text = '',
    operationText = text,
    messageText = operationText,
    actionText = operationText,
    action,
    cancel,
  }) {
    return (
      <Modal show={true} onHide={cancel}>
        <Modal.Header closeButton>
          <Modal.Title>{operationText}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{messageText}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={action}>
            {actionText}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  buildUpload({
    text = '',
    operationText = text,
    messageText = operationText,
    actionText = operationText,
    action,
    cancel,
  }) {
    return (
      <Modal show={true} onHide={cancel}>
        <Modal.Header closeButton>
          <Modal.Title>{operationText}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{messageText}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              document.getElementById('FormControl/UploadControl').click()
            }
          >
            {actionText}
          </Button>
          <FormControl
            id="FormControl/UploadControl"
            as="input"
            type="file"
            multiple={false}
            onChange={action}
            style={{ display: 'none' }}
          />
        </Modal.Footer>
      </Modal>
    );
  }
  async loadJsEditor(path) {
    const { workspace } = this.state;
    const file = `source/${path}`;
    await ensureFile(file, path, { workspace });
    this.updateUrl({ path });
    const data = await read(file);
    const jsEditorData =
      typeof data === 'string' ? data : new TextDecoder('utf8').decode(data);
    this.setState({ file, path, jsEditorData });
  }

  onChangeJsEditor(data) {
    this.setState({ jsEditorData: data });
  }

  async onClickEditorLink(url) {
    await this.loadJsEditor(url);
  }

  async doPublish() {
    const cancel = () => this.setState({ modal: undefined });
    const publish = () => this.setState({ modal: undefined });
    this.setState({
      modal: this.buildConfirm({ text: 'Publish', action: publish, cancel }),
    });
  }

  async doReload() {
    const cancel = () => this.setState({ modal: undefined });
    const reload = () => this.setState({ modal: undefined });
    this.setState({
      modal: this.buildConfirm({ text: 'Reload', action: reload, cancel }),
    });
  }

  async doUnload() {
    const cancel = () => this.setState({ modal: undefined });
    const unload = async () => {
      const { file } = this.state;
      await deleteFile({}, file);
      this.setState({ path: undefined, file: undefined, modal: undefined });
    };
    this.setState({
      modal: this.buildConfirm({
        text: 'Unload',
        messageText:
          'Unloading a file will discard any local changes permanantly. This cannot be undone.',
        action: unload,
        cancel,
      }),
    });
  }

  async doUpload() {
    const { file } = this.state;

    const upload = () => {
      const uploadControl = document.getElementById(
        'FormControl/UploadControl'
      );
      const handle = uploadControl.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target.result;
        await write(file, new Uint8Array(data));
        this.setState({ modal: undefined });
      };
      reader.readAsArrayBuffer(handle);
    };
    const cancel = () => this.setState({ modal: undefined });

    this.setState({
      modal: this.buildUpload({ text: 'Upload', action: upload, cancel }),
    });
  }

  async doRun() {
    const { path, jsEditorData } = this.state;
    await this.doSave();
    if (!path.endsWith('.js') && !path.endsWith('.nb')) {
      // We don't know how to run these things, so just save and move on.
      return;
    }
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
    let script = jsEditorData;
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

  async doSave(data) {
    const { file, jsEditorData } = this.state;
    const getCleanData = (data) => {
      try {
        // Just make a best attempt
        data = Prettier.format(jsEditorData, {
          trailingComma: 'es5',
          singleQuote: true,
          parser: 'babel',
          plugins: [PrettierParserBabel],
        });
      } catch (e) {
        // Then give up.
      }
      return data;
    };
    const cleanData = getCleanData(jsEditorData);
    await write(file, new TextEncoder('utf8').encode(cleanData));
    await log({ op: 'text', text: 'Saved', level: 'serious' });
    this.setState({ jsEditorData: cleanData });
  }

  render() {
    const {
      ask,
      file,
      path,
      jsEditorData = '',
      files,
      mode = 'Notebook',
      modal,
      running,
      workspace,
    } = this.state;
    const { sha } = this.props;

    const fileChoices = [
      ...new Set(
        files
          .filter(
            (file) =>
              file.startsWith('source/') &&
              (file.endsWith('.js') ||
                file.endsWith('.nb') ||
                file.endsWith('.svg') ||
                true)
          )
          .map((file) => file.substr(7))
      ),
    ];

    const navItems = [];
    const panes = [];

    navItems.push(
      <Nav.Item key="mode">
        <Form.Control
          as="select"
          value={mode}
          onChange={(e) => this.setState({ mode: e.target.value })}
        >
          <option>Notebook</option>
          <option>Files</option>
        </Form.Control>
      </Nav.Item>
    );

    switch (mode) {
      case 'Notebook': {
        const openFileTitle = async (e) => {
          if (e.key === 'Enter') {
            await this.loadJsEditor(path);
          }
        };

        navItems.push(
          <Nav.Item key="file">
            <Dropdown as={ButtonGroup}>
              <Form.Control
                value={path || ''}
                onKeyPress={openFileTitle}
                onChange={(e) => this.setState({ path: e.target.value })}
                style={{ width: '100%' }}
              />
              <Dropdown.Toggle
                split
                variant="outline-primary"
                id="file-selector"
              />
              <Dropdown.Menu>
                {fileChoices
                  .filter((option) => option !== file)
                  .map((file, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => this.loadJsEditor(file)}
                    >
                      {file}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </Nav.Item>
        );
        if (file) {
          navItems.push(
            <Nav key="run" className="mr-auto">
              <Nav.Item onClick={() => this.doRun()}>
                <Nav.Link>Run</Nav.Link>
              </Nav.Item>
            </Nav>
          );
          navItems.push(
            <Nav key="save" className="mr-auto">
              <Nav.Item onClick={() => this.doSave()}>
                <Nav.Link>Save</Nav.Link>
              </Nav.Item>
            </Nav>
          );
          navItems.push(
            <Nav key="publish" className="mr-auto">
              <Nav.Item onClick={() => this.doPublish()}>
                <Nav.Link disabled>Publish</Nav.Link>
              </Nav.Item>
            </Nav>
          );
          const upload = () => {
            const uploadControl = document.getElementById(
              'FormControl/UploadControl'
            );
            const handle = uploadControl.files[0];
            const reader = new FileReader();
            reader.onload = async (e) => {
              const data = e.target.result;
              await write(file, new Uint8Array(data));
              this.setState({ modal: undefined });
              await this.loadJsEditor(path);
            };
            reader.readAsArrayBuffer(handle);
          };
          navItems.push(
            <Nav key="upload" className="mr-auto">
              <Nav.Item
                onClick={() =>
                  document.getElementById('FormControl/UploadControl').click()
                }
              >
                <Nav.Link>Upload</Nav.Link>
                <FormControl
                  id="FormControl/UploadControl"
                  as="input"
                  type="file"
                  multiple={false}
                  onChange={upload}
                  style={{ display: 'none' }}
                />
              </Nav.Item>
            </Nav>
          );
          navItems.push(
            <Nav key="reload" className="mr-auto">
              <Nav.Item onClick={() => this.doReload()}>
                <Nav.Link disabled>Reload</Nav.Link>
              </Nav.Item>
            </Nav>
          );
          navItems.push(
            <Nav key="unload" className="mr-auto">
              <Nav.Item onClick={() => this.doUnload()}>
                <Nav.Link>Unload</Nav.Link>
              </Nav.Item>
            </Nav>
          );
          if (file.endsWith('.js') || file.endsWith('.nb')) {
            panes.push(
              <div>
                <SplitPane split="vertical" defaultSize={830}>
                  <Pane className="pane">
                    <JsEditorUi
                      key={`editScript/${file}`}
                      onRun={this.doRun}
                      onSave={this.doSave}
                      onChange={this.onChangeJsEditor}
                      onClickLink={this.onClickEditorLink}
                      data={jsEditorData}
                      file={file}
                      ask={ask}
                      workspace={workspace}
                    />
                  </Pane>
                  <Pane className="pane">
                    <NotebookUi
                      key={`notebook/${file}`}
                      sha={sha}
                      onRun={this.doRun}
                      file={file}
                      workspace={workspace}
                    />
                  </Pane>
                </SplitPane>
              </div>
            );
          } else if (file.endsWith('.svg')) {
            panes.push(
              <div>
                <SplitPane split="vertical" defaultSize={830}>
                  <Pane className="pane">
                    <JsEditorUi
                      key={`editScript/${file}`}
                      onRun={this.doRun}
                      onSave={this.doSave}
                      onChange={this.onChangeJsEditor}
                      onClickLink={this.onClickEditorLink}
                      data={jsEditorData}
                      file={file}
                      ask={ask}
                      workspace={workspace}
                    />
                  </Pane>
                  <Pane className="pane">
                    <img
                      src={`data:image/svg+xml;base64,${btoa(jsEditorData)}`}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Pane>
                </SplitPane>
              </div>
            );
          } else if (file.endsWith('.md')) {
            panes.push(
              <div>
                <SplitPane split="vertical" defaultSize={830}>
                  <Pane className="pane">
                    <JsEditorUi
                      key={`editScript/${file}`}
                      onRun={this.doRun}
                      onSave={this.doSave}
                      onChange={this.onChangeJsEditor}
                      onClickLink={this.onClickEditorLink}
                      data={jsEditorData}
                      file={file}
                      ask={ask}
                      workspace={workspace}
                    />
                  </Pane>
                  <Pane className="pane">
                    <div
                      dangerouslySetInnerHTML={{ __html: marked(jsEditorData) }}
                    />
                  </Pane>
                </SplitPane>
              </div>
            );
            setTimeout(() => Mermaid.init(undefined, '.mermaid'), 0);
          }
        }
        break;
      }
      case 'Files': {
        navItems.push(
          <Nav key="publish" className="mr-auto">
            <Nav.Item onClick={() => this.doPublish()}>
              <Nav.Link disabled>Publish</Nav.Link>
            </Nav.Item>
          </Nav>
        );
        navItems.push(
          <Nav key="reload" className="mr-auto">
            <Nav.Item onClick={() => this.doReload()}>
              <Nav.Link disabled>Reload</Nav.Link>
            </Nav.Item>
          </Nav>
        );
        navItems.push(
          <Nav key="unload" className="mr-auto">
            <Nav.Item onClick={() => this.doUnload()}>
              <Nav.Link disabled>Unload</Nav.Link>
            </Nav.Item>
          </Nav>
        );
        const counts = new Map();
        const prefixes = new Set();
        for (const file of fileChoices) {
          const parts = file.split('/');
          parts.pop();
          parts.push('');
          const prefix = parts.join('/');
          counts.set(prefix, (counts.get(prefix) || 0) + 1);
          prefixes.add(prefix);
          prefixes.add(file);
        }
        panes.push(
          <Form>
            <Form.Group>
              {[...prefixes]
                .filter((file) => !counts.has(file) || counts.get(file) >= 2)
                .map((file, nth) => (
                  <Form.Check key={nth} type="checkbox" label={file} />
                ))}
            </Form.Group>
          </Form>
        );
        break;
      }
    }

    navItems.push(
      <Nav className="mr-auto">
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
        {modal}
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
  let path = encodedFile ? decodeURIComponent(encodedFile) : '';
  let file = path ? `source/${path}` : '';
  ReactDOM.render(
    <Ui
      workspaces={[...filesystems]}
      workspace={workspace}
      file={file}
      path={path}
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
