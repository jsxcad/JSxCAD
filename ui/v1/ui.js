/* global FileReader, fetch, history, location, mermaid */

import * as PropTypes from 'prop-types';

import React, { PureComponent, render } from 'react';
import SplitPane, { Pane } from 'react-split-pane';
import {
  askService,
  ask as askSys,
  boot,
  clearEmitted,
  deleteFile,
  getServicePoolInfo,
  listFiles,
  listFilesystems,
  log,
  read,
  readOrWatch,
  resolvePending,
  setupFilesystem,
  sleep,
  terminateActiveServices,
  touch,
  unwatchFileCreation,
  unwatchFileDeletion,
  watchFileCreation,
  watchFileDeletion,
  write,
} from '@jsxcad/sys';
import { getNotebookControlData, toDomElement } from '@jsxcad/ui-notebook';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import JsEditorUi from './JsEditorUi';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Prettier from 'https://unpkg.com/prettier@2.3.2/esm/standalone.mjs';
import PrettierParserBabel from 'https://unpkg.com/prettier@2.3.2/esm/parser-babel.mjs';
import Spinner from 'react-bootstrap/Spinner';
import { animationFrame } from './schedule.js';
import { execute } from '@jsxcad/api';
import { fromPointsToAlphaShape2AsPolygonSegments } from '@jsxcad/algorithm-cgal';
import marked from 'marked';

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

class Ui extends PureComponent {
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
      file: this.props.file,
      path: this.props.path,
      selectedPaths: [],
      notebookNotes: {},
      notebookDefinitions: {},
      jsEditorAdvice: { domElementByHash: new Map() },
    };

    this.onChangeJsEditor = this.onChangeJsEditor.bind(this);
    this.onClickEditorLink = this.onClickEditorLink.bind(this);
    this.doPublishGist = this.doPublishGist.bind(this);
    this.doPublishToGithub = this.doPublishToGithub.bind(this);
    this.doReload = this.doReload.bind(this);
    this.doUncache = this.doUncache.bind(this);
    this.doRun = this.doRun.bind(this);
    this.doSave = this.doSave.bind(this);
    this.doStop = this.doStop.bind(this);
    this.doUnload = this.doUnload.bind(this);
    this.doUpload = this.doUpload.bind(this);
  }

  async componentDidMount() {
    const { jsEditorAdvice, file, path, workspace } = this.state;
    const { sha } = this.props;

    if (file && path) {
      await ensureFile(file, path, { workspace });
    }

    const clock = async () => {
      for (;;) {
        let { tick = 0 } = this.state;
        tick += 1;
        this.setState({ tick });
        await sleep(1000);
      }
    };
    clock();

    const onClickPrint = (event, filename, path, data, type) => {
      let url = 'http://192.168.31.235:88/';
      const done = async () => {
        if (path && !data) {
          data = await readOrWatch(path);
        }
        let response, error;
        try {
          response = await fetch(url, {
            mode: 'cors',
            method: 'post',
            body: data,
          });
        } catch (e) {
          error = e;
        }
        const done = () => this.setState({ modal: undefined });
        this.setState({
          modal: (
            <Modal show={true} onHide={done}>
              <Modal.Header closeButton>
                <Modal.Title>Print</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {error
                  ? `Error: ${error}`
                  : response.ok
                  ? 'Printed successfully'
                  : `Printed failed: ${response.status}`}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={done}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          ),
        });
      };
      const cancel = () => {
        this.setState({ modal: undefined });
      };
      this.setState({
        modal: (
          <Modal show={true} onHide={cancel}>
            <Modal.Header closeButton>
              <Modal.Title>Print</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Control
                name="url"
                value={url}
                onChange={(event) => {
                  url = event.target.value;
                }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={done}>
                Print
              </Button>
            </Modal.Footer>
          </Modal>
        ),
      });
    };

    const onClickView = (event, note) => {
      if (jsEditorAdvice.orbitView) {
        jsEditorAdvice.orbitView.openView = false;
      }
      jsEditorAdvice.orbitView = note;
      jsEditorAdvice.orbitView.openView = true;
    };

    const fileUpdater = async () => {
      const { workspace } = this.state;
      const workspaces = await listFilesystems();
      const files = await listFiles({ workspace });
      this.setState({ workspaces, files });
    };
    const creationWatcher = await watchFileCreation(fileUpdater);
    const deletionWatcher = await watchFileDeletion(fileUpdater);

    const askToplevelQuestion = async (question, transfer) =>
      askService(serviceSpec, question, transfer);

    const agent = async ({ ask, message, type }) => {
      const {
        op,
        entry,
        id,
        identifier,
        notes,
        options,
        path,
        sourceLocation,
        workspace,
      } = message;
      switch (op) {
        case 'sys/touch':
          await touch(path, { workspace, id, clear: true, broadcast: true });
          return;
        case 'ask':
          return askSys(identifier, options);
        case 'deleteFile':
          return deleteFile(options, path);
        case 'log':
          return log(entry);
        case 'notes':
          {
            const { notebookNotes, notebookDefinitions } = this.state;
            const { domElementByHash } = jsEditorAdvice;

            const { id, path } = sourceLocation;
            if (path !== this.state.path) {
              // These notes are for a different module.
              return;
            }

            const ensureNotebookNote = (note) => {
              if (!notebookNotes[note.hash]) {
                notebookNotes[note.hash] = note;
              }
              return notebookNotes[note.hash];
            };

            const domElement = document.createElement('div');
            // Attach the domElement invisibly so that we can compute the size.
            // Add it at the top so that it doesn't extend the bottom of the page.
            document.body.prepend(domElement);
            domElement.style.display = 'block';
            domElement.style.visibility = 'hidden';
            domElement.style.position = 'absolute';

            let nthView = 0;
            for (const note of notes) {
              if (note.hash === undefined) {
                continue;
              }
              const entry = ensureNotebookNote(note);
              if (entry.view) {
                nthView += 1;
                if (entry.sourceLocation) {
                  entry.sourceLocation.nthView = nthView;
                }
                const { orbitView } = jsEditorAdvice;
                entry.openView = false;
                if (orbitView) {
                  if (
                    orbitView.sourceLocation.id === id &&
                    orbitView.sourceLocation.nthView === nthView
                  ) {
                    entry.openView = true;
                  }
                }
              }
              if (domElementByHash.has(entry.hash)) {
                // Reuse the element we built earlier
                console.log(`Re-appending ${entry.hash} to ${id}`);
                domElement.appendChild(domElementByHash.get(entry.hash));
              } else {
                // We need to build the element.
                if (entry.view && !entry.url) {
                  const { workspace } = this.state;
                  const { path, view } = entry;
                  const { width, height } = view;
                  const canvas = document.createElement('canvas');
                  canvas.width = width;
                  canvas.height = height;
                  const offscreenCanvas = canvas.transferControlToOffscreen();
                  const render = async () => {
                    try {
                      const url = await askToplevelQuestion(
                        {
                          op: 'staticView',
                          path,
                          workspace,
                          view,
                          offscreenCanvas,
                        },
                        [offscreenCanvas]
                      );
                      const element = domElementByHash.get(entry.hash);
                      if (element && element.firstChild) {
                        element.firstChild.src = url;
                      }
                    } catch (error) {
                      if (error.message === 'Terminated') {
                        // Try again.
                        return render();
                      } else {
                        window.alert(error.stack);
                      }
                    }
                  };
                  // Render the image asynchronously -- it won't affect layout.
                  render();
                }

                const element = toDomElement([entry], {
                  onClickView,
                  onClickPrint,
                });
                domElementByHash.set(entry.hash, element);
                console.log(`Appending ${entry.hash} to ${id}`);
                domElement.appendChild(element);
                console.log(`Marking ${entry.hash} in ${id}`);
              }
            }

            await animationFrame();

            notebookDefinitions[id] = {
              notes,
              domElement,
            };

            if (jsEditorAdvice.onUpdate) {
              await jsEditorAdvice.onUpdate();
            }
          }
          return;
        case 'info':
          return;
        default:
          throw Error(`Unknown operation ${op}`);
      }
    };

    const serviceSpec = {
      webWorker: `./webworker.js#${sha}`,
      agent,
      workerType: 'module',
    };

    this.setState({
      ask: askToplevelQuestion,
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
    const files = await listFiles({ workspace });
    this.setState({
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
  async loadJsEditor(path, { shouldUpdateUrl = true } = {}) {
    const { workspace } = this.state;
    const file = `source/${path}`;
    await ensureFile(file, path, { workspace });
    if (shouldUpdateUrl) {
      this.updateUrl({ path });
    }
    const data = await read(file);
    const jsEditorData =
      typeof data === 'string' ? data : new TextDecoder('utf8').decode(data);
    this.setState({ file, path, jsEditorData });

    // Let state propagate.
    await animationFrame();

    // Automatically run the notebook on load. The user can hit Stop.
    await this.doRun();
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
      const [, , , owner, repository, branch, path] =
        gitcdnPath.match(
          /^(http|https):[/][/]gitcdn.(xyz|link)[/]cdn[/]([^/]*)[/]([^/]*)[/]([^/]*)[/](.*)$/
        ) || [];
      if (owner && repository && branch && path) {
        const unit = `${owner}/${repository}/${branch}`;
        if (!publications.has(unit)) {
          publications.set(unit, {
            owner,
            repository,
            branch,
            paths: [],
            sourcePaths: [],
          });
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
        entry.status = await writeToGithub(
          owner,
          repository,
          branch,
          paths,
          sourcePaths,
          { replaceRepository: false }
        );
      }
      this.setState({
        modal: (
          <Modal show={true} onHide={cancel}>
            <Modal.Header closeButton>
              <Modal.Title>Published to Github</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {[...publications.values()].map(
                ({ owner, repository, branch, paths, status }, nth) => [
                  nth > 0 && <hr />,
                  <div key={nth}>
                    Update {owner}/{repository} in branch {branch}:
                    <ul>
                      {paths.map((path, nth) => (
                        <li key={nth}>{path}</li>
                      ))}
                    </ul>
                    {status ? 'Succeeded' : 'Failed'}
                  </div>,
                ]
              )}
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
            {[...publications.values()].map(
              ({ owner, repository, branch, paths }, nth) => [
                nth > 0 && <hr />,
                <div key={nth}>
                  Publish to {owner}/{repository} in branch {branch}:
                  <ul>
                    {paths.map((path, nth) => (
                      <li key={nth}>{path}</li>
                    ))}
                  </ul>
                </div>,
              ]
            )}
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

  async doReload(paths) {
    const cancel = () => this.setState({ modal: undefined });
    const reload = async () => {
      const { path } = this.state;
      for (const path of paths) {
        await deleteFile({}, `source/${path}`);
        await read(`source/${path}`, { sources: [path] });
      }
      await this.loadJsEditor(path);
      this.setState({
        selectedPaths: [],
        modal: undefined,
      });
    };
    this.setState({
      modal: (
        <Modal show={true} onHide={cancel}>
          <Modal.Header closeButton>
            <Modal.Title>Unload</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Reloading will discard any local changes permanantly. This cannot be
            undone.
            <p />
            Reload the following paths?
            <ul>
              {paths.map((path, nth) => (
                <li key={nth}>{path}</li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={reload}>
              Reload
            </Button>
          </Modal.Footer>
        </Modal>
      ),
    });
  }

  async doUncache(paths) {
    const { files } = this.state;
    const uncached = [];
    for (const file of files) {
      if (file.startsWith('source/') || file.startsWith('control/')) {
        // These are the only unregeneratable files.
        console.log(`QQ/uncache/no: ${file}`);
      } else {
        await deleteFile({}, file);
        uncached.push(file);
      }
    }
    const cancel = () => this.setState({ modal: undefined });
    this.setState({
      modal: (
        <Modal show={true} onHide={cancel}>
          <Modal.Header closeButton>
            <Modal.Title>Uncache</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Computed geometry cache deleted.
            <ul>
              {uncached.map((file, index) => (
                <li key={index}>{file}</li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancel}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      ),
    });
  }

  async doUnload(paths) {
    const cancel = () => this.setState({ modal: undefined });
    const unload = async () => {
      for (const path of paths) {
        await deleteFile({}, `source/${path}`);
      }
      this.setState({
        path: undefined,
        file: undefined,
        selectedPaths: [],
        modal: undefined,
      });
    };
    this.setState({
      modal: (
        <Modal show={true} onHide={cancel}>
          <Modal.Header closeButton>
            <Modal.Title>Unload</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Unloading will discard any local changes permanantly. This cannot be
            undone.
            <p />
            Unload the following paths?
            <ul>
              {paths.map((path, nth) => (
                <li key={nth}>{path}</li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={unload}>
              Unload
            </Button>
          </Modal.Footer>
        </Modal>
      ),
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

  async doStop() {
    const { running } = this.state;
    if (!running) {
      return;
    }
    try {
      await terminateActiveServices();
    } finally {
      this.setState({ running: false });
    }
  }

  clearLog() {
    const { logElement } = this.state;
    if (logElement) {
      while (logElement.firstChild) {
        logElement.removeChild(logElement.firstChild);
      }
    }
    const logStartDate = new Date();
    this.setState({ logStartDate });
  }

  async doRun(options) {
    const { ask, jsEditorData, jsEditorAdvice, path, workspace } =
      Object.assign({}, this.state, options);
    const { sha } = this.props;
    const topLevel = new Map();
    try {
      this.setState({ running: true });
      await terminateActiveServices();
      clearEmitted();
      this.clearLog();

      await this.doSave();
      if (!path.endsWith('.js') && !path.endsWith('.nb')) {
        // We don't know how to run these things, so just save and move on.
        return;
      }

      // FIX: This is a bit awkward.
      // The responsibility for updating the control values ought to be with what
      // renders the notebook.
      const notebookControlData = await getNotebookControlData();
      await write(`control/${path}`, notebookControlData);

      let script = jsEditorData;
      const evaluate = async (script) => {
        try {
          const result = await ask({
            op: 'evaluate',
            script,
            workspace,
            path,
            sha,
          });
          if (result) {
            return result;
          } else {
            // The error will have come back via a note.
            throw Error('Evaluation failed');
          }
        } catch (error) {
          throw error;
        }
      };
      const replay = async (script) => {
        try {
          const result = await ask({
            op: 'evaluate',
            script,
            workspace,
            path,
            sha,
          });
          if (result) {
            return result;
          } else {
            // The error will have come back via a note.
            throw Error('Evaluation failed');
          }
        } catch (error) {
          throw error;
        }
      };
      jsEditorAdvice.definitions = topLevel;
      await execute(script, {
        evaluate,
        replay,
        path,
        topLevel,
      });
      await resolvePending();
    } catch (error) {
      // Include any high level notebook errors in the output.
      window.alert(error.stack);
    } finally {
      this.setState({ running: false });
    }
  }

  async doSave(data) {
    const { file, jsEditorData } = this.state;
    const getCleanData = (data) => {
      if (file.endsWith('.js') || file.endsWith('.nb')) {
        // Just make a best attempt to reformat.
        data = Prettier.format(jsEditorData, {
          trailingComma: 'es5',
          singleQuote: true,
          parser: 'babel',
          plugins: [PrettierParserBabel],
        });
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
      jsEditorAdvice,
      files,
      mode = 'Notebook',
      modal,
      notebookDefinitions,
      notebookNotes,
      running,
      selectedPaths,
      workspace,
    } = this.state;

    const windowWidth = Math.floor(window.innerWidth);

    const fileChoices = [
      ...new Set(
        files
          .filter((file) => file.startsWith('source/'))
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
            <Nav key="stop" className="mr-auto">
              <Nav.Item onClick={() => this.doStop()}>
                <Nav.Link>Stop</Nav.Link>
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
              <Nav.Item onClick={() => this.doReload([path])}>
                <Nav.Link>Reload</Nav.Link>
              </Nav.Item>
            </Nav>
          );
          navItems.push(
            <Nav key="uncache" className="mr-auto">
              <Nav.Item onClick={() => this.doUncache([path])}>
                <Nav.Link>Uncache</Nav.Link>
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
          if (file.endsWith('.svg')) {
            panes.push(
              <div>
                <SplitPane split="vertical" defaultSize={windowWidth / 2}>
                  <Pane key="first" className="pane">
                    <img
                      src={`data:image/svg+xml;base64,${btoa(jsEditorData)}`}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Pane>
                  <Pane key="second" className="pane">
                    <JsEditorUi
                      key={`editScript/${file}`}
                      onRun={this.doRun}
                      onSave={this.doSave}
                      onChange={this.onChangeJsEditor}
                      onClickLink={this.onClickEditorLink}
                      data={jsEditorData}
                      file={file}
                      path={path}
                      ask={ask}
                      workspace={workspace}
                    />
                  </Pane>
                </SplitPane>
              </div>
            );
          } else if (file.endsWith('.cloud')) {
            const resolution = 0.25;
            let svg;
            let points = [];
            for (const line of jsEditorData.split('\n')) {
              try {
                const [x = 0, y = 0] = JSON.parse(line);
                points.push([x, y]);
              } catch (e) {
                // Ignore.
              }
            }
            const segments = fromPointsToAlphaShape2AsPolygonSegments(
              points,
              0,
              10,
              false
            );
            const onSvgClick = (e) => {
              const p = svg.createSVGPoint();
              p.x = e.clientX;
              p.y = e.clientY;
              var ctm = svg.getScreenCTM().inverse();
              const q = p.matrixTransform(ctm);
              const x = Math.round(q.x / resolution) * resolution;
              const y = Math.round(q.y / resolution) * resolution;
              this.setState({ jsEditorData: `${jsEditorData}\n[${x}, ${y}]` });
            };
            const onPointClick = (e, index) => {
              e.stopPropagation();
              const lines = jsEditorData.split('\n');
              lines.splice(index, 1);
              const updated = lines.join('\n');
              this.setState({ jsEditorData: updated });
            };
            panes.push(
              <div>
                <SplitPane split="vertical" defaultSize={windowWidth / 2}>
                  <Pane key="first" className="pane">
                    <svg
                      ref={(ref) => {
                        svg = ref;
                      }}
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ margin: '5px' }}
                      onClick={onSvgClick}
                    >
                      {segments.map(
                        ([[startX, startY], [endX, endY]], index) => (
                          <line
                            key={`l${index}`}
                            x1={startX}
                            y1={startY}
                            x2={endX}
                            y2={endY}
                            stroke="blue"
                            strokeWidth={resolution}
                          />
                        )
                      )}
                      {points.map(([x, y], index) => (
                        <circle
                          key={`c${index}`}
                          cx={x}
                          cy={y}
                          r={resolution}
                          onClick={(e) => onPointClick(e, index)}
                        />
                      ))}
                    </svg>
                  </Pane>
                  <Pane key="second" className="pane">
                    <JsEditorUi
                      key={`editScript/${file}`}
                      onRun={this.doRun}
                      onSave={this.doSave}
                      onChange={this.onChangeJsEditor}
                      onClickLink={this.onClickEditorLink}
                      data={jsEditorData}
                      file={file}
                      path={path}
                      ask={ask}
                      workspace={workspace}
                    />
                  </Pane>
                </SplitPane>
              </div>
            );
          } else if (file.endsWith('.stl')) {
            panes.push(
              <div>
                <SplitPane split="vertical" defaultSize={windowWidth / 2}>
                  <Pane key="first" className="pane">
                    <JsEditorUi
                      key={`editScript/${file}`}
                      onRun={this.doRun}
                      onSave={this.doSave}
                      onChange={this.onChangeJsEditor}
                      onClickLink={this.onClickEditorLink}
                      data={jsEditorData}
                      file={file}
                      path={path}
                      ask={ask}
                      workspace={workspace}
                    />
                  </Pane>
                </SplitPane>
              </div>
            );
          } else if (file.endsWith('.md')) {
            panes.push(
              <div>
                <SplitPane split="vertical" defaultSize={windowWidth / 2}>
                  <Pane key="first" className="pane">
                    <div
                      dangerouslySetInnerHTML={{ __html: marked(jsEditorData) }}
                    />
                  </Pane>
                  <Pane key="second" className="pane">
                    <JsEditorUi
                      key={`editScript/${file}`}
                      onRun={this.doRun}
                      onSave={this.doSave}
                      onChange={this.onChangeJsEditor}
                      onClickLink={this.onClickEditorLink}
                      data={jsEditorData}
                      file={file}
                      path={path}
                      ask={ask}
                      workspace={workspace}
                    />
                  </Pane>
                </SplitPane>
              </div>
            );
            setTimeout(() => mermaid.init(undefined, '.mermaid'), 0);
          } else {
            const serviceInfo = [];
            for (const service of getServicePoolInfo().activeServices) {
              const { finished, released, worker, waiting } = service;
              serviceInfo.push(
                <p>
                  {service.id}{' '}
                  {JSON.stringify({
                    finished,
                    released,
                    hasWorker: !!worker,
                    waiting,
                  })}
                  <br />
                </p>
              );
              for (const { question } of [
                ...service.conversation.openQuestions.values(),
              ]) {
                serviceInfo.push(<p>{JSON.stringify(question)}</p>);
              }
              serviceInfo.push(<hr />);
              for (const entry of service.conversation.history) {
                serviceInfo.push(<p>{JSON.stringify(entry)}</p>);
              }
              serviceInfo.push(<hr />);
              serviceInfo.push(<hr />);
            }
            // Try to edit it.
            panes.push(
              <div style={{ width: '100%', height: '100%', margin: '0px' }}>
                <Col style={{ width: '100%', height: '100%' }}>
                  <SplitPane split="vertical" defaultSize={128}>
                    <Pane key="first" className="pane">
                      <div
                        style={{ width: '100%', height: '100%', margin: '0px' }}
                      >
                        <Col
                          style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'aliceblue',
                            whiteSpace: 'nowrap',
                            overflowX: 'hidden',
                            overflowY: 'scroll',
                          }}
                        >
                          {serviceInfo}
                        </Col>
                      </div>
                    </Pane>
                    <Pane key="second" className="pane">
                      <div
                        style={{ width: '100%', height: '100%', margin: '0px' }}
                      >
                        <Col style={{ width: '100%', height: '100%' }}>
                          <SplitPane
                            split="vertical"
                            defaultSize={windowWidth / 2 - 256}
                          >
                            <Pane
                              key="first"
                              className="pane orbit-view-container"
                            ></Pane>
                            <Pane key="second" className="pane">
                              <JsEditorUi
                                key={`editScript/${file}`}
                                onRun={this.doRun}
                                onSave={this.doSave}
                                onChange={this.onChangeJsEditor}
                                onClickLink={this.onClickEditorLink}
                                data={jsEditorData}
                                advice={jsEditorAdvice}
                                file={file}
                                path={path}
                                ask={ask}
                                workspace={workspace}
                                notebookDefinitions={notebookDefinitions}
                                notebookNotes={notebookNotes}
                              />
                            </Pane>
                          </SplitPane>
                        </Col>
                      </div>
                    </Pane>
                  </SplitPane>
                </Col>
              </div>
            );
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
            <Nav.Item onClick={() => this.doReload(selectedPaths)}>
              <Nav.Link>Reload</Nav.Link>
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
        {getServicePoolInfo().activeServiceCount}
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
  const startPath = `https://gitcdn.link/cdn/jsxcad/JSxCAD/${sha}/nb/start.nb`;
  document
    .getElementById('loading')
    .appendChild(document.createTextNode('Indexing Storage. '));
  const filesystems = await listFilesystems();
  const decodeHash = () => {
    const hash = location.hash.substring(1);
    const [encodedWorkspace, encodedFile] = hash.split('@');
    const workspace = decodeURIComponent(encodedWorkspace) || 'JSxCAD';
    const path = encodedFile ? decodeURIComponent(encodedFile) : startPath;
    const file = `source/${path}`;
    return [path, file, workspace];
  };
  const [path, file, workspace] = decodeHash();
  let ui;
  document
    .getElementById('loading')
    .appendChild(document.createTextNode('Starting React. '));
  render(
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
    const { path = startPath } = e.state || {};
    ui.loadJsEditor(path, { shouldUpdateUrl: false });
  });

  window.addEventListener('hashchange', (e) => {
    const [path] = decodeHash();
    ui.loadJsEditor(path, { shouldUpdateUrl: false });
  });
};

export const installUi = async ({ document, workspace, sha }) => {
  await boot();
  document
    .getElementById('loading')
    .appendChild(document.createTextNode('Booted. '));
  if (workspace !== '') {
    await setupFilesystem({ fileBase: workspace });
  }
  document
    .getElementById('loading')
    .appendChild(document.createTextNode('Setup UI. '));
  await setupUi(sha);
};
