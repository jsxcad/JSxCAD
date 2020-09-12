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
import { writeGist } from './gist.js';
import { writeToGithub } from './github.js';

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
      selectedPaths: [],
    };

    this.onChangeJsEditor = this.onChangeJsEditor.bind(this);
    this.onClickEditorLink = this.onClickEditorLink.bind(this);
    this.doPublishGist = this.doPublishGist.bind(this);
    this.doPublishToGithub = this.doPublishToGithub.bind(this);
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
    const encodedWorkspace = encodeURIComponent(workspace);
    history.pushState(
      { path },
      null,
      `#${encodedWorkspace}${path ? '@' : ''}${path}`
    );
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
    this.setState({
      paneLayout,
      paneViews,
      workspace,
      files,
      selectedPaths: [],
    });
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

  async doPublishGist(paths) {
    let titleElement;
    const cancel = () => this.setState({ modal: undefined });
    const done = () => this.setState({ modal: undefined });
    const publish = async () => {
      const title = titleElement.value;
      const url = await writeGist({ title, paths });
      if (url) {
        this.setState({
          modal: (
            <Modal show={true} onHide={cancel}>
              <Modal.Header closeButton>
                <Modal.Title>Published Gist</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                The gist {title} can be found at <a href={url}>{url}</a>.
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={done}>
                  Done
                </Button>
              </Modal.Footer>
            </Modal>
          ),
        });
      } else {
        this.setState({
          modal: (
            <Modal show={true} onHide={cancel}>
              <Modal.Header closeButton>
                <Modal.Title>Published Gist</Modal.Title>
              </Modal.Header>
              <Modal.Body>A gist could not be created.</Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={done}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          ),
        });
      }
    };
    this.setState({
      modal: (
        <Modal show={true} onHide={cancel}>
          <Modal.Header closeButton>
            <Modal.Title>Publish Gist</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Gist title{' '}
            <Form.Control
              ref={(ref) => {
                titleElement = ref;
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={publish}>
              Publish Gist
            </Button>
          </Modal.Footer>
        </Modal>
      ),
    });
  }

  async doPublishToGithub(paths) {
    const publications = new Map();

    // Decode gitcdn paths.
    for (const gitcdnPath of paths) {
      const [, , owner, repository, branch, path] = gitcdnPath.match(/^(http|https):[/][/]gitcdn.link[/]cdn[/]([^/]*)[/]([^/]*)[/]([^/]*)[/](.*)$/) || [];
      if (owner && repository && branch && path) {
        const unit = `${owner}/${repository}/${branch}`;
        if (!publications.has(unit)) {
          publications.set(unit, { owner, repository, branch, paths: [], sourcePaths: [] });
        }
        const entry = publications.get(unit);
        entry.paths.push(path);
        entry.sourcePaths.push(gitcdnPath);
      }
    }

    const cancel = () => this.setState({ modal: undefined });
    const done = () => this.setState({ modal: undefined });
    const publish = async () => {
      for (const entry of publications.values()) {
        const { owner, repository, branch, paths, sourcePaths } = entry;
        entry.status = await writeToGithub(owner, repository, branch, paths, sourcePaths, { replaceRepository: false });
      }
      this.setState({
        modal: (
          <Modal show={true} onHide={cancel}>
            <Modal.Header closeButton>
              <Modal.Title>Published to Github</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {
               [...publications.values()].map(
                 ({ owner, repository, branch, paths, status }, nth) =>
                    <div key={nth}>
                      Update {owner}/{repository}:
                      <ul>{paths.map((path, nth) => <li key={nth}>{path}</li>)}</ul>
                      { status ? 'Succeeded' : 'Failed' }
                    </div>)
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={done}>
                Done
              </Button>
            </Modal.Footer>
          </Modal>
        ),
      });
    };
    this.setState({
      modal: (
        <Modal show={true} onHide={cancel}>
          <Modal.Header closeButton>
            <Modal.Title>Publish to Github</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              {
               [...publications.values()].map(
                 ({ owner, repository, branch, paths }, nth) =>
                    <div key={nth}>
                      Publish to {owner}/{repository}:
                      <ul>{paths.map((path, nth) => <li key={nth}>{path}</li>)}</ul>
                    </div>)
              }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={publish}>
              Publish to Github
            </Button>
          </Modal.Footer>
        </Modal>
      ),
    });
  }

  async doReload() {
    const cancel = () => this.setState({ modal: undefined });
    const reload = () => this.setState({ modal: undefined });
    this.setState({
      modal: this.buildConfirm({ text: 'Reload', action: reload, cancel }),
    });
  }

  async doUnload(paths) {
    const cancel = () => this.setState({ modal: undefined });
    const unload = async () => {
      for (const path of paths) {
        await deleteFile({}, `source/${path}`);
      }
      this.setState({ path: undefined, file: undefined, selectedPaths: [], modal: undefined });
    };
    this.setState({
      modal: <Modal show={true} onHide={cancel}>
              <Modal.Header closeButton>
                <Modal.Title>Unload</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Unloading will discard any local changes permanantly. This cannot be undone.
                <p/>
                Unload the following paths?
                <ul>
                  {paths.map((path, nth) => <li key={nth}>{path}</li>)}
                </ul>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={cancel}>Cancel</Button>
                <Button variant="primary" onClick={unload}>Unload</Button>
              </Modal.Footer>
            </Modal>
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
    const { ask, file, jsEditorData, path, workspace } = this.state;
    await this.doSave();
    if (!path.endsWith('.js') && !path.endsWith('.nb')) {
      // We don't know how to run these things, so just save and move on.
      return;
    }
    let notebook;
    try {
      this.setState({ running: true });
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
      notebook = await ask({ evaluate: ecmascript, workspace, path: file });
      await resolvePending();
    } catch (error) {
      emit({ log: { text: error.stack, level: 'serious' } });
    } finally {
      this.setState({ running: false });
    }

    const writeNotebook = async (path, notebook) => {
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
      selectedPaths,
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
            <Nav key="publish_gist" className="mr-auto">
              <Nav.Item onClick={() => this.doPublishGist([path])}>
                <Nav.Link>Publish Gist</Nav.Link>
              </Nav.Item>
            </Nav>
          );
          navItems.push(
            <Nav key="publish_to_github" className="mr-auto">
              <Nav.Item onClick={() => this.doPublishToGithub([path])}>
                <Nav.Link>Publish to Github</Nav.Link>
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
              <Nav.Item onClick={() => this.doUnload([path])}>
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
          <Nav key="publish_gist" className="mr-auto">
            <Nav.Item onClick={() => this.doPublishGist(selectedPaths)}>
              <Nav.Link>Publish Gist</Nav.Link>
            </Nav.Item>
          </Nav>
        );
        navItems.push(
          <Nav key="publish_to_github" className="mr-auto">
            <Nav.Item onClick={() => this.doPublishToGithub(selectedPaths)}>
              <Nav.Link>Publish to Github</Nav.Link>
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
            <Nav.Item onClick={() => this.doUnload(selectedPaths)}>
              <Nav.Link>Unload</Nav.Link>
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
        const check = (file, checked) => {
          const updated = selectedPaths.filter((value) => value !== file);
          if (checked) {
            updated.push(file);
          }
          this.setState({ selectedPaths: updated });
        };
        panes.push(
          <Form>
            <Form.Group>
              {[...prefixes]
                .filter((file) => !counts.has(file) || counts.get(file) >= 2)
                .map((file, nth) => (
                  <Form.Check
                    key={nth}
                    type="checkbox"
                    label={file}
                    checked={selectedPaths.includes(file)}
                    onChange={({ target }) => check(file, target.checked)}
                  />
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
  let ui;
  ReactDOM.render(
    <Ui
      ref={(ref) => {
        ui = ref;
      }}
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

  window.addEventListener('popstate', (e) => {
    const { path = '' } = e.state;
    ui.loadJsEditor(path);
  });
};

export const installUi = async ({ document, workspace, sha }) => {
  await boot();
  if (workspace !== '') {
    await setupFilesystem({ fileBase: workspace });
  }
  await setupUi(sha);
};
