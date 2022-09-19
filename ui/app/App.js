/* global FileReader */

import * as PropTypes from 'prop-types';

import {
  askService,
  ask as askSys,
  boot,
  clearCacheDb,
  clearEmitted,
  getActiveServices,
  listFiles,
  log,
  logInfo,
  read,
  remove,
  resolvePending,
  setConfig,
  terminateActiveServices,
  watchFileCreation,
  watchFileDeletion,
  watchLog,
  watchServices,
  write,
} from '@jsxcad/sys';

import { getNotebookControlData, toDomElement } from '@jsxcad/ui-notebook';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import FlexLayout from 'flexlayout-react';
import Form from 'react-bootstrap/Form';
import JsEditorUi from './JsEditorUi.js';
import JsViewerUi from './JsViewerUi.js';
import ListGroup from 'react-bootstrap/ListGroup';
import OrbitView from './OrbitView.js';
import Prettier from 'https://unpkg.com/prettier@2.3.2/esm/standalone.mjs';
import PrettierParserBabel from 'https://unpkg.com/prettier@2.3.2/esm/parser-babel.mjs';
import React from 'react';
import ReactDOM from 'react-dom';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { animationFrame } from './schedule.js';
import { execute } from '@jsxcad/api';

const ensureFile = async (file, url, { workspace } = {}) => {
  const sources = [];
  if (url !== undefined) {
    sources.push(url);
  }
  // Ensure the file exists.
  // TODO: Handle a transform from file to source so that things github can be used sensibly.
  const content = await read(`${file}`, { sources, workspace });
  if (content === undefined) {
    // If we couldn't find it, create it as an empty file.
    await write(`${file}`, '', { workspace });
  }
};

const isRegenerable = (file) =>
  file.startsWith('data/') ||
  file.startsWith('meta/') ||
  file.startsWith('view/') ||
  file.startsWith('download/');

const defaultModelConfig = {
  global: {
    rootOrientationVertical: true,
  },
  borders: [
    {
      type: 'border',
      location: 'left',
      weight: 50,
      children: [
        {
          id: 'Workspace',
          type: 'tab',
          name: 'Workspace',
          component: 'Workspace',
          enableClose: false,
          borderWidth: 512,
        },
        {
          id: 'View',
          type: 'tab',
          name: 'View',
          component: 'View',
          enableClose: false,
        },
        {
          id: 'Make',
          type: 'tab',
          name: 'Make',
          component: 'Make',
          enableClose: false,
        },
        {
          id: 'Share',
          type: 'tab',
          name: 'Share',
          component: 'Share',
          enableClose: false,
        },
        {
          id: 'Help',
          type: 'tab',
          name: 'Help',
          component: 'Help',
          enableClose: false,
        },
        {
          id: 'Log',
          type: 'tab',
          name: 'Log',
          component: 'Log',
          enableClose: false,
          borderWidth: 1024,
        },
        {
          id: 'Files',
          type: 'tab',
          name: 'Files',
          component: 'Files',
          enableClose: false,
          borderWidth: 1024,
        },
        {
          id: 'Config',
          type: 'tab',
          name: 'Config',
          component: 'Config',
          enableClose: false,
          borderWidth: 1024,
        },
      ],
    },
  ],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        id: 'Notebooks',
        type: 'tabset',
        weight: 100,
        enableDeleteWhenEmpty: false,
        children: [],
      },
      {
        id: 'Clipboards',
        type: 'tabset',
        weight: 100,
        enableDeleteWhenEmpty: false,
        children: [
          {
            id: 'Clipboard',
            type: 'tab',
            name: 'Clipboard',
            component: 'Clipboard',
            enableClose: false,
            borderWidth: 1024,
          },
        ],
      },
    ],
  },
};

class App extends React.Component {
  static get propTypes() {
    return {
      workspace: PropTypes.string,
      sha: PropTypes.string,
      path: PropTypes.start,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { sha, workspace } = this.props;

    this.agent = async ({ ask, message, type }) => {
      const { op, entry, identifier, notes, options, path, sourceLocation } =
        message;
      switch (op) {
        case 'ask':
          return askSys(identifier, options);
        case 'deleteFile':
          return remove(options, path);
        case 'log':
          return log(entry);
        case 'notes':
          {
            const { id, path } = sourceLocation;
            const NotebookTextKey = `NotebookText/${path}`;

            if (this.state[NotebookTextKey] === undefined) {
              // These notes are for an unloaded module.
            }

            const NotebookAdvice = this.Notebook.ensureAdvice(path);
            const { domElementByHash, notebookNotes, notebookDefinitions } =
              NotebookAdvice;

            const ensureNotebookNote = (note) => {
              if (!notebookNotes[note.hash]) {
                notebookNotes[note.hash] = note;
              }
              return notebookNotes[note.hash];
            };

            let wip = document.getElementById('notebook/wip');
            if (!wip) {
              wip = document.createElement('div');
              wip.id = 'notebook/wip';
              // Attach the wip invisibly so that we can compute the size.
              // Add it at the top so that it doesn't extend the bottom of the page.

              document.body.prepend(wip);
              wip.style.display = 'block';
              wip.style.visibility = 'hidden';
              wip.style.position = 'absolute';
            }
            const domElements = [];

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
                const { orbitView } = NotebookAdvice;
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
                console.log(`Re-appending ${entry.hash} to ${path}/${id}`);
                // FIX: This is a problem because it removes the child from where it
                // was.
                // domElement.appendChild(domElementByHash.get(entry.hash));
                domElements.push(domElementByHash.get(entry.hash));
              } else {
                const element = toDomElement([entry], {
                  onClickView: ({ path, view, workspace, sourceLocation }) =>
                    this.Notebook.clickView({
                      path,
                      view,
                      workspace,
                      sourceLocation,
                    }),
                  onClickMake: ({ path, workspace, sourceLocation }) =>
                    this.Notebook.clickMake({
                      path,
                      workspace,
                      sourceLocation,
                    }),
                  workspace,
                });
                domElementByHash.set(entry.hash, element);
                console.log(`Appending ${entry.hash} to ${path}/${id}`);
                wip.appendChild(element);
                domElements.push(element);
                console.log(`Marking ${entry.hash} in ${path}/${id}`);

                await animationFrame();

                // We need to build the element.
                const cachedUrl = await read(`thumbnail/${entry.hash}`, {
                  workspace,
                });
                if (cachedUrl) {
                  const render = async () => {
                    console.log(`Retrieved thumbnail for ${path}/${id}`);
                    if (element && element.firstChild) {
                      element.firstChild.src = cachedUrl;
                    }
                  };
                  render();
                } else if (entry.view && !entry.url) {
                  const { path, view } = entry;
                  const { width, height } = view;
                  const canvas = document.createElement('canvas');
                  canvas.width = width;
                  canvas.height = height;
                  const offscreenCanvas = canvas.transferControlToOffscreen();
                  const render = async () => {
                    try {
                      logInfo('app/App', `Ask render for ${path}/${id}`);
                      const url = await this.ask(
                        {
                          op: 'app/staticView',
                          path,
                          workspace,
                          view,
                          offscreenCanvas,
                        },
                        { path },
                        [offscreenCanvas]
                      );
                      console.log(`Finished render for ${path}/${id}`);
                      // Cache the thumbnail for next time.
                      await write(`thumbnail/${entry.hash}`, url, {
                        workspace,
                      });
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
                  console.log(`Schedule render for ${path}/${id}`);
                  render();
                }
              }
            }

            await animationFrame();

            notebookDefinitions[id] = {
              notes,
              wip,
              domElements,
            };

            if (NotebookAdvice.onUpdate) {
              await NotebookAdvice.onUpdate();
            }
          }
          return;
        default:
          throw Error(`Unknown operation ${op}`);
      }
    };

    this.serviceSpec = {
      webWorker: `./webworker.js#${sha}`,
      agent: this.agent,
      workerType: 'module',
    };

    this.ask = async (question, context, transfer) =>
      askService(this.serviceSpec, question, transfer, context).answer;

    this.layoutRef = React.createRef();

    this.Clipboard = {};

    this.Clipboard.change = (data) => {
      const { Clipboard = {} } = this.state;
      this.setState({ Clipboard: { ...Clipboard, code: data } });
    };

    this.Clipboard.getCode = (data) => {
      const { Clipboard = {} } = this.state;
      const { code = 'const $ = Group();' } = Clipboard;
      return code;
    };

    this.Clipboard.run = () => {};

    this.Clipboard.save = () => {};

    this.Config = {};

    this.Config.path = (path) => {
      const { Config = {} } = this.state;
      let object = { Config };
      const steps = path.split('/');
      while (steps.length > 0) {
        const step = steps.shift();
        if (object[step] === undefined) {
          object[step] = {};
        }
        object = object[step];
      }
      return object;
    };

    this.Config.update = async () => {
      const { Config = {} } = this.state;
      const form = document.getElementById('form/Config');
      this.Config.path('Config/api/shape/endTimer').md =
        form['Config/api/shape/endTimer/md'].checked;
      await this.updateState({ Config });
      await this.Config.store();
      setConfig(Config);
      window.alert('Configuration updated');
    };

    this.Config.store = async () => {
      const { workspace } = this.props;
      const { Config } = this.state;
      await write('config/Config', Config, { workspace });
    };

    this.Config.restore = async () => {
      const { workspace } = this.props;
      const Config = await read('config/Config', { workspace });
      setConfig(Config);
      await this.updateState({ Config });
    };

    this.Files = {};

    this.Files.deleteCachedFiles = async () => {
      const { workspace } = this.props;
      await clearCacheDb({ workspace });
      window.alert('Cached files deleted');
    };

    this.Files.deleteSourceFile = async (file) => {
      const { workspace } = this.props;
      const { WorkspaceFiles = [] } = this.state;
      await remove(file, { workspace });
      await this.updateState({
        WorkspaceFiles: WorkspaceFiles.filter((entry) => entry !== file),
      });
    };

    this.Layout = {};

    this.Layout.action = (action) => {
      console.log(JSON.stringify(action));
      return action;
    };

    this.Layout.buildSpinners = (path) => {
      const pieces = ['<span>&nbsp;&nbsp;</span>'];
      const count = this.servicesActiveCounts[path];
      for (let nth = 0; nth < count; nth++) {
        pieces.push(
          '<span id="spinner" style={{display: "inline-block", width: "10px"}}/>'
        );
      }
      return pieces.join('');
    };

    this.Layout.updateSpinners = (path) => {
      const spinners = document.getElementById(`Spinners/Notebook/${path}`);
      if (spinners) {
        spinners.innerHTML = this.Layout.buildSpinners(path);
      }
    };

    this.Layout.renderTab = (tabNode, values) => {
      const { buttons } = values;
      const id = tabNode.getId();
      if (id.startsWith('Notebook/')) {
        buttons.push(
          <span
            id={`Spinners/${id}`}
            dangerouslySetInnerHTML={this.Layout.buildSpinners(
              id.substring('Notebook/'.length)
            )}
          />
        );
      }
    };

    this.Log = {};

    this.Log.clear = async () => {
      this.updateState({ LogMessages: [], LogFilter: '' });
    };

    this.Log.updateFilter = async (LogFilter) => {
      this.updateState({ LogFilter });
    };

    this.Log.pendingMessages = [];

    this.Log.updating = false;

    this.Model = {};

    this.Model.change = async () => {
      if (this.Model.changing) {
        return;
      }
      try {
        this.Model.changing = true;
        await this.Model.store();
      } finally {
        this.Model.changing = false;
        this.updateHash();
      }
    };

    this.Model.store = async (json) => {
      if (this.Model.saving) {
        return;
      }
      try {
        this.Model.saving = true;
        const { workspace } = this.props;
        const { model } = this.state;
        await write(
          'config/Model',
          { persistentModelConfig: json || model.toJson() },
          { workspace }
        );
      } finally {
        this.Model.saving = false;
      }
    };

    this.Model.reset = async () => {
      await this.Model.store(defaultModelConfig);
      await this.Model.restore();
    };

    this.Model.restore = async () => {
      const { persistentModelConfig = defaultModelConfig } =
        (await read('config/Model', { workspace })) || {};
      // Reconstruct WorkspaceOpenPaths from the layout, so they stay in sync.
      const WorkspaceOpenPaths = [];
      for (const tabset of persistentModelConfig.layout.children) {
        if (tabset.id !== 'Notebooks') {
          continue;
        }
        for (const { id } of tabset.children) {
          WorkspaceOpenPaths.push(id.substring(9));
        }
      }
      for (const path of WorkspaceOpenPaths) {
        await this.Notebook.load(path);
      }
      const model = FlexLayout.Model.fromJson(persistentModelConfig);
      await this.updateState({ model, WorkspaceOpenPaths });
    };

    this.Notebook = {};

    this.Notebook.clickView = async ({ path, view, sourceLocation }) => {
      const { model } = this.state;
      await this.updateState({ View: { path, view, sourceLocation } });
      // This is a bit of a hack, since selectTab toggles.
      model.getNodeById('View').getParent()._setSelected(-1);
      model.doAction(FlexLayout.Actions.selectTab('View'));
      await animationFrame();
      this.View.store();
    };

    this.Notebook.clickMake = async ({ path, id, sourceLocation }) => {
      await this.updateState({ Make: { path, id, sourceLocation } });
    };

    this.Notebook.runStart = {};

    this.Notebook.getSelectedPath = () => {
      const { model } = this.state;
      const tabset = model.getNodeById('Notebooks');
      const { selected } = tabset._attributes;
      if (selected === -1) {
        return;
      }
      const tab = tabset._children[selected];
      return tab._attributes.id.substring('Notebook/'.length);
    };

    this.Notebook.run = async (path, options) => {
      if (!path) {
        return;
      }
      logInfo('app/App', `Request notebook run ${path}`);
      // Note the time that this run started.
      // This can be used to note which assets are obsoleted by the completion of the run.
      this.Notebook.runStart[path] = new Date();

      const { sha, workspace } = this.props;
      const NotebookAdvice = this.Notebook.ensureAdvice(path);
      const NotebookPath = path;
      const topLevel = new Map();
      const profile = new Map();
      const updateProfile = (times) => {
        for (const [name, entry] of times) {
          const { total } = entry;
          if (!profile.has(name)) {
            profile.set(name, total);
          } else {
            profile.set(name, profile.get(name) + total);
          }
        }
      };
      const logProfile = () => {
        const entries = [...profile];
        entries.sort(([aName, aTotal], [bName, bTotal]) => aTotal - bTotal);
        for (const [name, total] of entries) {
          logInfo('app/Profile', `${name} ${total}`);
        }
      };
      try {
        await this.updateState({ NotebookState: 'running' });
        // Terminate any services running for this path, since we're going to restart evaluating it.
        await terminateActiveServices((context) => context.path === path);
        // CHECK: Can we get rid of this?
        clearEmitted();

        const NotebookText = await this.Notebook.save(path);

        if (!NotebookPath.endsWith('.js') && !NotebookPath.endsWith('.nb')) {
          // We don't know how to run anything else.
          return;
        }

        // FIX: This is a bit awkward.
        // The responsibility for updating the control values ought to be with what
        // renders the notebook.
        const notebookControlData = await getNotebookControlData();
        await write(`control/${NotebookPath}`, notebookControlData, {
          workspace,
        });

        let script = this.Clipboard.getCode() + NotebookText;

        const evaluate = async (script) => {
          try {
            const result = await this.ask(
              {
                op: 'app/evaluate',
                script,
                workspace,
                path: NotebookPath,
                sha,
              },
              { path }
            );
            if (result) {
              updateProfile(result);
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
            const result = await this.ask(
              {
                op: 'app/evaluate',
                script,
                workspace,
                path: NotebookPath,
                sha,
              },
              { path }
            );
            if (result) {
              updateProfile(result);
              return result;
            } else {
              // The error will have come back via a note.
              throw Error('Evaluation failed');
            }
          } catch (error) {
            throw error;
          }
        };
        NotebookAdvice.definitions = topLevel;
        await execute(script, {
          evaluate,
          replay,
          path: NotebookPath,
          topLevel,
          workspace,
        });
        await resolvePending();
      } catch (error) {
        // Include any high level notebook errors in the output.
        window.alert(error.stack);
      } finally {
        await this.updateState({ NotebookState: 'idle' });
        logInfo('app/App', `Completed notebook run ${path}`);
        logProfile();
      }
    };

    this.Notebook.load = async (path) => {
      const { workspace } = this.props;
      const notebookPath = path;
      const notebookFile = `source/${notebookPath}`;
      await ensureFile(notebookFile, notebookPath, { workspace });
      const data = await read(notebookFile, { workspace });
      const notebookText =
        typeof data === 'string' ? data : new TextDecoder('utf8').decode(data);

      this.Notebook.ensureAdvice(path);
      await this.updateState({ [`NotebookText/${path}`]: notebookText });

      // Let state propagate.
      await animationFrame();

      // Automatically run the notebook on first load.
      if (!this.Notebook.runStart[path]) {
        this.Notebook.run(path);
      }

      return notebookText;
    };

    this.Notebook.save = async (path) => {
      logInfo('app/App/Notebook/save', `Saving Notebook ${path}`);
      const { workspace } = this.props;
      const { [`NotebookText/${path}`]: NotebookText } = this.state;
      const NotebookPath = path;
      const NotebookFile = `source/${NotebookPath}`;
      const getCleanText = (data) => {
        if (NotebookPath.endsWith('.js') || NotebookPath.endsWith('.nb')) {
          // Just make a best attempt to reformat.
          data = Prettier.format(NotebookText, {
            trailingComma: 'es5',
            singleQuote: true,
            parser: 'babel',
            plugins: [PrettierParserBabel],
          });
        }
        return data;
      };
      logInfo('app/App/Notebook/save', `Cleaning Notebook ${path}`);
      const cleanText = getCleanText(NotebookText);
      logInfo('app/App/Notebook/save', `Writing Notebook ${path}`);
      await write(NotebookFile, new TextEncoder('utf8').encode(cleanText), {
        workspace,
      });
      logInfo('app/App/Notebook/save', `Updating state for Notebook ${path}`);
      await this.updateState({ [`NotebookText/${path}`]: cleanText });

      // Let state propagate.
      await animationFrame();

      logInfo('app/App/Notebook/save', `Saving complete for ${path}`);
      return cleanText;
    };

    this.Notebook.cycleMode = async (path) => {
      // await this.Notebook.close(path);
      const { [`NotebookMode/${path}`]: mode } = this.state;
      let newMode;
      switch (mode) {
        case 'edit':
          newMode = 'view';
          break;
        default:
        case 'view':
          newMode = 'edit';
          break;
      }
      await this.updateState({ [`NotebookMode/${path}`]: newMode });
      this.Notebook.store();
      // this.Notebook.clickLink(path);
    };

    this.Notebook.change = (path, data) => {
      console.log(`QQ/Notebook.change: ${path} ${data}`);
      this.setState({ [`NotebookText/${path}`]: data });
    };

    this.Notebook.clickLink = async (path) => {
      if (!path) {
        return;
      }
      const { model } = this.state;
      await this.Workspace.loadWorkingPath(path);
      // This is a bit of a hack, since selectTab toggles.
      const nodeId = `Notebook/${path}`;
      model.getNodeById(nodeId).getParent()._setSelected(-1);
      model.doAction(FlexLayout.Actions.selectTab(nodeId));
      await animationFrame();
      this.View.store();
      await this.Notebook.run(path);
    };

    this.Notebook.close = async (closedPath) => {
      const { model, WorkspaceOpenPaths = [] } = this.state;
      await this.updateState({
        [`NotebookText/${closedPath}`]: undefined,
        [`NotebookAdvice/${closedPath}`]: undefined,
        WorkspaceOpenPaths: WorkspaceOpenPaths.filter(
          (path) => path !== closedPath
        ),
      });
      model.doAction(FlexLayout.Actions.deleteTab(`Notebook/${closedPath}`));
      await animationFrame();
      this.Workspace.store();
    };

    this.Notebook.ensureAdvice = (path) => {
      const key = `NotebookAdvice/${path}`;
      const existingAdvice = this.state[key];
      if (existingAdvice) {
        return existingAdvice;
      }
      const createdAdvice = {
        notebookNotes: {},
        notebookDefinitions: {},
        domElementByHash: new Map(),
      };
      this.setState({ [key]: createdAdvice });
      return createdAdvice;
    };

    this.Notebook.store = async () => {
      const state = {};
      for (const key of Object.keys(this.state)) {
        if (key.startsWith('NotebookMode/')) {
          state[key] = this.state[key];
        }
      }
      await write('config/Notebook', state, { workspace });
    };

    this.Notebook.restore = async () => {
      const { workspace } = this.props;
      const state = await read('config/Notebook', { workspace });
      await this.updateState({ ...state });
    };

    this.View = {};

    this.View.pendingOperations = [];
    this.View.operationsScheduled = false;

    this.View.click = ({ object, ray }) => {};

    this.View.executeOperations = async () => {
      try {
        while (this.View.pendingOperations.length > 0) {
          const paths = new Set();
          // Run a complete update cycle.
          while (this.View.pendingOperations.length > 0) {
            const operations = this.View.pendingOperations;
            this.View.pendingOperations = [];
            for (const { path, operation } of operations) {
              await operation();
              if (path) {
                paths.add(path);
              }
            }
          }
          // We defer the rerun of the notebook to the user, but we save at this point.
          for (const path of paths) {
            await this.Notebook.save(path);
          }
          // See if we got more ops while while we were working.
        }
      } finally {
        this.View.operationsScheduled = false;
      }
    };

    this.View.scheduleOperation = ({ path, operation }) => {
      this.View.pendingOperations.push({ path, operation });
      if (this.View.operationsScheduled) {
        // We're already processing these.
        return;
      }
      // Start processing.
      this.View.operationsScheduled = true;
      this.View.executeOperations();
    };

    this.View.edits = async ({ edits, editId }) => {
      const points = [];
      const segments = [];
      for (const edit of edits) {
        const [, type] = edit;
        switch (type) {
          case 'point': {
            const [, , point] = edit;
            points.push(
              `[${point[0].toFixed(2)}, ${point[1].toFixed(
                2
              )}, ${point[2].toFixed(2)}]`
            );
            break;
          }
          case 'segment': {
            const [, , source, target] = edit;
            segments.push(
              `[[${source[0].toFixed(2)}, ${source[1].toFixed(
                2
              )}, ${source[2].toFixed(2)}], [${target[0].toFixed(
                2
              )}, ${target[1].toFixed(2)}, ${target[2].toFixed(2)}]]`
            );
            break;
          }
        }
      }
      const ops = [];
      if (points.length > 0) {
        ops.push(`Points([${points.join(', ')}])`);
      }
      if (segments.length > 0) {
        ops.push(`Segments([${segments.join(', ')}])`);
      }
      switch (ops.length) {
        case 0: {
          this.Clipboard.change(``);
          break;
        }
        case 1: {
          this.Clipboard.change(`const ${editId} = ${ops[0]};`);
          break;
        }
        default: {
          this.Clipboard.change(`const ${editId} = Group(${ops.join(', ')});`);
          break;
        }
      }
    };

    this.View.jogPendingUpdate = new Map();

    this.View.jog = async (update) => {
      /*
      const { object, path } = update;

      if (object) {
        this.View.jogPendingUpdate.set(object, update);
      }

      const operation = async () => {
        if (!this.View.jogPendingUpdate.has(object)) {
          // We already handled this jog.
          return;
        }
        const { sourceLocation, at, to, up } =
          this.View.jogPendingUpdate.get(object);
        const { viewId } = object.userData;
        this.View.jogPendingUpdate.delete(object);
        const request = {
          viewId,
          nth: object.parent.children.findIndex((value) => value === object),
          at: getWorldPosition(at, 0.01),
          to: getWorldPosition(to, 0.01),
          up: getWorldPosition(up, 0.01),
        };
        if (request.nth === undefined) {
          return;
        }
        console.log(JSON.stringify(request));
        const { path } = sourceLocation;
        const { [`NotebookText/${path}`]: NotebookText } = this.state;
        const newNotebookText = rewriteViewGroupOrient(NotebookText, request);
        await this.updateState({
          [`NotebookText/${path}`]: newNotebookText,
        });
      };

      this.View.scheduleOperation({ path, operation });
      */
    };

    this.View.keydown = async ({
      deleteObject,
      event,
      object,
      sourceLocation,
      at,
      to,
      up,
      placeObject,
    }) => {
      /*
      switch (event.key) {
        case 'Backspace':
        case 'Delete': {
          if (deleteObject && object) {
            deleteObject(object);
          }
          const { path } = sourceLocation;
          const { viewId } = object.userData;
          const operation = async () => {
            const { [`NotebookText/${path}`]: NotebookText } = this.state;
            const newNotebookText = deleteViewGroupCode(NotebookText, {
              viewId,
              nth: object.parent.children.findIndex(
                (value) => value === object
              ),
            });
            await this.updateState({
              [`NotebookText/${path}`]: newNotebookText,
            });
          };
          this.View.scheduleOperation({ path, operation });
          return false;
        }

        case 'c':
          if (!event.getModifierState('Control')) {
            break;
          }
        // fall through to Copy
        case 'Copy': {
          const { path } = sourceLocation;
          const operation = async () => {
            // We should have already extracted the source into userData.
            // Other operations may have made this introspection out of date.
            const { [`NotebookText/${path}`]: NotebookText } = this.state;
            const { viewId } = object.userData;
            const nth = object.parent.children.findIndex(
              (value) => value === object
            );
            const { code } = extractViewGroupCode(NotebookText, {
              viewId,
              nth,
            });
            await this.updateState({
              Clipboard: { path, code, viewId, nth, object },
            });
          };
          this.View.scheduleOperation({ path, operation });
          return false;
        }

        case 'x':
          if (!event.getModifierState('Control')) {
            break;
          }
        // fall through to Cut
        case 'Cut': {
          if (deleteObject && object) {
            deleteObject(object);
          }
          const { path } = sourceLocation;
          const { viewId } = object.userData;
          const operation = async () => {
            const { [`NotebookText/${path}`]: NotebookText } = this.state;
            const nth = object.parent.children.findIndex(
              (value) => value === object
            );
            const { code } = extractViewGroupCode(NotebookText, {
              viewId,
              nth,
            });
            const newNotebookText = deleteViewGroupCode(NotebookText, {
              viewId,
              nth,
            });
            await this.updateState({
              [`NotebookText/${path}`]: newNotebookText,
              Clipboard: { code, viewId, object },
            });
          };
          this.View.scheduleOperation({ path, operation });
          return false;
        }

        case 'v':
          if (!event.getModifierState('Control')) {
            break;
          }
        // fall through to Paste
        case 'Insert':
        case 'Paste': {
          const { path } = sourceLocation;
          const { Clipboard = {} } = this.state;
          const { code, viewId, object } = Clipboard;
          if (!code) {
            return;
          }
          if (placeObject && object) {
            placeObject(object, { at });
          }
          const request = {
            viewId,
            code,
            at: getWorldPosition(at, 0.01),
            to: getWorldPosition(to, 0.01),
            up: getWorldPosition(up, 0.01),
          };
          const operation = async () => {
            const { [`NotebookText/${path}`]: NotebookText } = this.state;
            const newNotebookText = appendViewGroupCode(NotebookText, request);
            await this.updateState({
              [`NotebookText/${path}`]: newNotebookText,
            });
          };
          this.View.scheduleOperation({ path, operation });
          return false;
        }
      }
    */
    };

    this.View.move = async ({ path, position, up, target, zoom }) => {
      if (this.View.moving) {
        return;
      }
      try {
        this.View.moving = true;
        await this.View.trackballState.store(path, {
          position,
          up,
          target,
          zoom,
        });
      } finally {
        this.View.moving = false;
      }
    };

    this.View.state = { anchorObject: null, anchors: [] };

    this.View.store = async () => {
      const { workspace } = this.props;
      const { View } = this.state;
      await write('config/View', View, { workspace });
    };

    this.View.restore = async () => {
      const { workspace } = this.props;
      const View = await read('config/View', { workspace });
      await this.updateState({ View });
    };

    this.View.updateGeometry = async ({
      geometryPath,
      path,
      updateGeometry,
      workspace,
    }) => {
      const geometry = await read(geometryPath, { workspace });
      await updateGeometry(geometry, {
        timestamp: this.Notebook.runStart[path],
      });
    };

    this.View.trackballState = {};

    this.View.trackballState.store = async (
      path,
      { position, up, target, zoom }
    ) => {
      if (this.View.saving) {
        return;
      }
      try {
        this.View.saving = true;
        const { workspace } = this.props;
        await write(
          `config/View/trackballState/${path}`,
          { position, up, target, zoom },
          { workspace }
        );
      } finally {
        this.View.saving = false;
      }
    };

    this.View.trackballState.load = async (path) => {
      const { workspace } = this.props;
      const { position, up, target, zoom } =
        (await read(`config/View/trackballState/${path}`, { workspace })) || {};
      return { position, up, target, zoom };
    };

    this.Workspace = {};

    this.Workspace.loadWorkingPath = async (path) => {
      const {
        model,
        WorkspaceOpenPaths = [],
        [`NotebookMode/${path}`]: mode,
      } = this.state;
      if (WorkspaceOpenPaths.includes(path)) {
        // FIX: Add indication?
        return;
      }
      await this.updateState({
        WorkspaceOpenPaths: [...WorkspaceOpenPaths, path],
      });
      const text = await this.Notebook.load(path);
      if (!mode) {
        await this.updateState({
          [`NotebookMode/${path}`]: text ? 'view' : 'edit',
        });
      }
      const nodeId = `Notebook/${path}`;
      const toNameFromPath = (path) => {
        const pieces = path.split('/');
        return pieces[pieces.length - 1];
      };
      this.layoutRef.current.addTabToTabSet('Notebooks', {
        id: nodeId,
        type: 'tab',
        name: toNameFromPath(path),
        component: 'Notebook',
      });
      model
        .getNodeById(nodeId)
        .setEventListener('close', () => this.Notebook.close(path));
      await this.Workspace.store();
    };

    this.Workspace.uploadWorkingPath = async (path, e) => {
      const { workspace } = this.props;

      const file = document.getElementById('WorkspaceUploadControl').files[0];
      const reader = new FileReader();
      const writeData = async (data) => {
        await write(`source/${path}`, new Uint8Array(data), { workspace });
      };
      reader.onload = (e) => writeData(e.target.result);
      reader.readAsArrayBuffer(file);
    };

    this.Workspace.openWorkingFile = async (file) => {
      const path = file.substring('source/'.length);
      await this.Notebook.clickLink(path);
      this.Notebook.run(path);
    };

    this.Workspace.store = async () => {
      if (this.Workspace.saving) {
        return;
      }
      try {
        this.Model.saving = true;
        const { workspace } = this.props;
        const { WorkspaceOpenPaths, WorkspaceLoadPath, WorkspaceLoadPrefix } =
          this.state;
        const config = {
          WorkspaceOpenPaths,
          WorkspaceLoadPath,
          WorkspaceLoadPrefix,
        };
        await write('config/Workspace', config, { workspace });
      } finally {
        this.Workspace.saving = false;
      }
    };

    this.Workspace.restore = async () => {
      // We restore WorkspaceOpenPaths via Model.restore.
      const {
        WorkspaceLoadPath,
        WorkspaceLoadPrefix = 'https://github.com/jsxcad/JSxCAD/tree/master/nb/',
      } = await read('config/Workspace', { workspace, otherwise: {} });
      await this.updateState({ WorkspaceLoadPath, WorkspaceLoadPrefix });
    };

    this.Workspace.export = async (prefix) => {
      const { WorkspaceFiles = [] } = this.state;
      const { workspace } = this.props;
      const directory = await window.showDirectoryPicker({ mode: 'readwrite' });
      const sourcePrefix = `source/${prefix}`;
      const getFile = async (cwd, pieces) => {
        if (pieces.length >= 2) {
          return getFile(
            await cwd.getDirectoryHandle(pieces[0], { create: true }),
            pieces.slice(1)
          );
        } else {
          return cwd.getFileHandle(pieces[0], { create: true });
        }
      };
      for (const path of WorkspaceFiles) {
        if (path.startsWith(sourcePrefix)) {
          const file = await getFile(
            directory,
            path.substring(sourcePrefix.length).split('/')
          );
          const writable = await file.createWritable();
          const data = await read(path, { workspace });
          await writable.write(data);
          await writable.close();
        }
      }
      await this.Workspace.store();
    };

    this.factory = (node) => {
      switch (node.getComponent()) {
        case 'Workspace': {
          const {
            WorkspaceFiles = [],
            WorkspaceOpenPaths = [],
            WorkspaceLoadPath = '',
            WorkspaceLoadPrefix = '',
          } = this.state;
          const isDisabled = (file) =>
            WorkspaceOpenPaths.includes(file.substring(7));
          const computeListItemVariant = (file) =>
            isDisabled(file) ? 'secondary' : 'primary';
          return (
            <div>
              <Card>
                <Card.Body>
                  <Card.Title>Load Working Path</Card.Title>
                  <Card.Text>
                    <Form>
                      <Row>
                        <Col>
                          <Form.Group controlId="WorkspaceLoadPrefixId">
                            <Form.Control
                              placeholder="Prefix"
                              onChange={(e) =>
                                this.updateState({
                                  WorkspaceLoadPrefix: e.target.value,
                                })
                              }
                              value={WorkspaceLoadPrefix}
                            />
                            <Form.Text>Prefix</Form.Text>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Button
                            onClick={() => {
                              const { WorkspaceLoadPrefix } = this.state;
                              this.Workspace.export(WorkspaceLoadPrefix);
                            }}
                            disabled={!WorkspaceLoadPrefix}
                          >
                            Export
                          </Button>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Form.Group controlId="WorkspaceLoadPathId">
                            <Form.Control
                              placeholder="URL or Path"
                              onChange={(e) =>
                                this.updateState({
                                  WorkspaceLoadPath: e.target.value,
                                })
                              }
                              value={WorkspaceLoadPath}
                            />
                            <Form.Text>Path</Form.Text>
                          </Form.Group>
                        </Col>
                        <Col xs="auto">
                          <Button
                            variant="primary"
                            onClick={() => {
                              const { WorkspaceLoadPath, WorkspaceLoadPrefix } =
                                this.state;
                              this.Workspace.loadWorkingPath(
                                `${WorkspaceLoadPrefix}${WorkspaceLoadPath}`
                              );
                            }}
                            disabled={!WorkspaceLoadPath}
                          >
                            Add
                          </Button>
                          <Form.Control
                            as="input"
                            type="file"
                            id="WorkspaceUploadControl"
                            multiple={false}
                            onChange={(e) => {
                              const { WorkspaceLoadPath } = this.state;
                              this.Workspace.uploadWorkingPath(
                                `${WorkspaceLoadPrefix}${WorkspaceLoadPath}`,
                                e
                              );
                            }}
                            style={{ display: 'none' }}
                          />
                          &nbsp;
                          <Button
                            variant="primary"
                            onClick={() => {
                              document
                                .getElementById('WorkspaceUploadControl')
                                .click();
                            }}
                            disabled={!WorkspaceLoadPath}
                          >
                            Upload
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Open Working Path</Card.Title>
                  <Card.Text>
                    <ListGroup>
                      {WorkspaceFiles.filter((file) =>
                        file.startsWith('source/')
                      ).map((file, index) => (
                        <ListGroup.Item
                          variant={computeListItemVariant(file)}
                          key={index}
                          action
                          disabled={isDisabled(file)}
                          active={false}
                          onClick={(event) => {
                            event.target.blur();
                            this.Workspace.openWorkingFile(file);
                          }}
                        >
                          {file.substring(7)}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          );
        }
        case 'Notebook': {
          const path = node.getId().substring('Notebook/'.length);
          const {
            [`NotebookMode/${path}`]: NotebookMode = 'view',
            [`NotebookText/${path}`]: NotebookText,
          } = this.state;
          const NotebookAdvice = this.Notebook.ensureAdvice(path);
          switch (NotebookMode) {
            case 'edit':
              return (
                <JsEditorUi
                  mode={NotebookMode}
                  onRun={() => this.Notebook.run(path)}
                  onSave={() => this.Notebook.save(path)}
                  onChange={(data) => this.Notebook.change(path, data)}
                  onClickLink={(path) => this.Notebook.clickLink(path)}
                  data={NotebookText}
                  advice={NotebookAdvice}
                  // onClose={() => this.Notebook.close(path)}
                />
              );
            default:
            case 'view':
              return (
                <JsViewerUi
                  mode={NotebookMode}
                  onRun={() => this.Notebook.run(path)}
                  onSave={() => this.Notebook.save(path)}
                  onChange={(data) => this.Notebook.change(path, data)}
                  onClickLink={(path) => this.Notebook.clickLink(path)}
                  data={NotebookText}
                  advice={NotebookAdvice}
                  // onClose={() => this.Notebook.close(path)}
                />
              );
          }
        }
        case 'Clipboard': {
          const { Clipboard = {} } = this.state;
          const { code = '' } = Clipboard;
          return (
            <JsEditorUi
              onRun={() => this.Clipboard.run()}
              onSave={() => this.Clipboard.save()}
              onChange={(data) => this.Clipboard.change(data)}
              data={code}
            />
          );
        }
        case 'View': {
          const { workspace } = this.props;
          const { View = {} } = this.state;
          const trackballState = this.View.trackballState.load(View.path);
          return (
            <OrbitView
              path={View.path}
              view={View.view}
              sourceLocation={View.sourceLocation}
              workspace={workspace}
              onClick={this.View.click}
              onEdits={this.View.edits}
              onJog={this.View.jog}
              onKeydown={this.View.keydown}
              onMove={this.View.move}
              onUpdateGeometry={this.View.updateGeometry}
              trackballState={trackballState}
            />
          );
        }
        case 'Help': {
          return (
            <div>
              <blockquote>
                These links will open in a separate window.
                <ul>
                  <li>
                    <a
                      href="https://github.com/jsxcad/JSxCAD/blob/master/nb/start.md"
                      target="help"
                    >
                      Getting Started
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/jsxcad/JSxCAD/blob/master/nb/api/index.md"
                      target="help"
                    >
                      API Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/jsxcad/JSxCAD/blob/master/nb/projects/index.md"
                      target="help"
                    >
                      Projects
                    </a>
                  </li>
                </ul>
              </blockquote>
            </div>
          );
        }
        case 'Files': {
          const { WorkspaceFiles = [] } = this.state;
          return (
            <div>
              <Card>
                <Card.Body>
                  <Card.Title>Clear Cached Files</Card.Title>
                  <Card.Text>
                    <Button
                      variant="primary"
                      onClick={this.Files.deleteCachedFiles}
                    >
                      Delete Regeneable Files
                    </Button>
                  </Card.Text>
                </Card.Body>
                <Card.Body>
                  <Card.Title>Source Files</Card.Title>
                  <Card.Text>
                    <Table striped border hover>
                      <tbody>
                        {WorkspaceFiles.filter(
                          (file) => !isRegenerable(file)
                        ).map((file, index) => (
                          <tr key={index}>
                            <td>
                              <Button
                                onClick={() =>
                                  this.Files.deleteSourceFile(file)
                                }
                              >
                                Delete
                              </Button>
                            </td>
                            <td>{file}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Text>
                </Card.Body>
                <Card.Body>
                  <Card.Title>Reset Layout</Card.Title>
                  <Card.Text>
                    <Button variant="primary" onClick={this.Model.reset}>
                      Reset
                    </Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          );
        }
        case 'Log': {
          const { LogMessages = [], LogFilter = '^app/Profile' } = this.state;
          return (
            <div>
              <Card>
                <Card.Body>
                  <Card.Title>Log Messages</Card.Title>
                  <Card.Text>
                    <Form>
                      <Row>
                        <Col>
                          <Form.Group controlId="LogFilterId">
                            <Form.Control
                              placeholder="Filter source by regex"
                              value={LogFilter}
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Button
                            variant="primary"
                            onClick={() => {
                              const { value } =
                                document.getElementById('LogFilterId');
                              this.Log.updateFilter(value);
                            }}
                          >
                            Update Filter
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                    <Button variant="primary" onClick={this.Log.clear}>
                      Clear
                    </Button>
                    <Table striped border hover>
                      <thead>
                        <tr>
                          <td>ID</td>
                          <td>Type</td>
                          <td>Source</td>
                          <td>Message</td>
                        </tr>
                      </thead>
                      <tbody>
                        {LogMessages.filter(
                          ({ source }) =>
                            !source || !LogFilter || source.match(LogFilter)
                        ).map(({ type, source, text, id }, index) => (
                          <tr key={index}>
                            <td>{id}</td>
                            <td>{type}</td>
                            <td>{source}</td>
                            <td>{text}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          );
        }
        case 'Config': {
          return (
            <div>
              <Card>
                <Card.Body>
                  <Card.Title>Configuration</Card.Title>
                  <Card.Text>
                    <Form id="form/Config">
                      <Button variant="primary" onClick={this.Config.update}>
                        Update
                      </Button>
                      <Form.Group controlId="Config/api/shape/endTimer/md">
                        <Form.Check
                          type="checkbox"
                          label="Emit md from endTimer"
                          checked={
                            this.Config.path('Config/api/shape/endTimer').md
                          }
                        />
                      </Form.Group>
                    </Form>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          );
        }
      }
    };

    this.fileUpdater = async () => {
      await this.updateState({
        WorkspaceFiles: await listFiles({ workspace }),
      });
    };

    this.logUpdater = ({ id, type, source, text }) => {
      this.Log.pendingMessages.unshift({ id, type, source, text });
      if (this.Log.updating) {
        return;
      }
      const spool = async () => {
        try {
          while (this.Log.pendingMessages.length > 0) {
            const commit = this.Log.pendingMessages;
            this.Log.pendingMessages = [];
            const { LogFilter = '^app/Profile', LogMessages = [] } = this.state;
            const filter = ({ source }) =>
              !source || !LogFilter || source.match(LogFilter);
            await this.updateState({
              LogMessages: [...commit, ...LogMessages.slice(0, 99)].filter(
                filter
              ),
            });
          }
        } finally {
          this.Log.updating = false;
        }
      };
      this.Log.updating = true;
      spool();
    };

    this.servicesUpdater = () => {
      const { WorkspaceOpenPaths = [] } = this.state;
      const servicesActiveCounts = {};
      for (const path of WorkspaceOpenPaths) {
        servicesActiveCounts[path] = 0;
      }
      for (const { context } of getActiveServices()) {
        if (context && context.path) {
          servicesActiveCounts[context.path] += 1;
        }
      }
      this.servicesActiveCounts = servicesActiveCounts;
      for (const path of WorkspaceOpenPaths) {
        this.Layout.updateSpinners(path);
      }
    };

    this.creationWatcher = await watchFileCreation(this.fileUpdater);
    this.deletionWatcher = await watchFileDeletion(this.fileUpdater);
    this.logWatcher = watchLog(this.logUpdater);
    this.servicesWatcher = watchServices(this.servicesUpdater);

    window.onhashchange = ({ newURL }) => {
      const hash = new URL(newURL).hash.substring(1);
      let [workspace, path] = hash.split('@');
      if (path === undefined) {
        path = workspace;
        workspace = 'JSxCAD';
      }
      this.Notebook.clickLink(path);
    };

    this.servicesActiveCounts = {};

    await this.fileUpdater();
    await this.Config.restore();
    await this.Workspace.restore();
    await this.View.restore();
    await this.Notebook.restore();
    await this.Model.restore();

    this.Notebook.clickLink(this.props.path);

    window.addEventListener('keydown', (e) => this.onKeyDown(e));
  }

  updateHash() {
    const path = this.Notebook.getSelectedPath();
    const hash = path ? `#${path}` : '';
    if (window.location.hash !== hash) {
      window.history.pushState(null, null, hash);
    }
  }

  onKeyDown(e) {
    const CONTROL = 17;
    const E = 69;
    const ENTER = 13;
    const S = 83;
    const SHIFT = 16;

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
          this.Notebook.run(this.Notebook.getSelectedPath());
          return false;
        }
        break;
      }
      case S: {
        if (ctrlKey) {
          e.preventDefault();
          e.stopPropagation();
          this.Notebook.save(this.Notebook.getSelectedPath());
          return false;
        }
        break;
      }
      case E: {
        if (ctrlKey) {
          e.preventDefault();
          e.stopPropagation();
          this.Notebook.cycleMode(this.Notebook.getSelectedPath());
          return false;
        }
        break;
      }
    }
  }

  async updateState(state) {
    return new Promise((resolve, reject) => {
      this.setState(state, () => resolve());
    });
  }

  render() {
    const { model } = this.state;
    if (!model) {
      return;
    }
    return (
      <FlexLayout.Layout
        ref={this.layoutRef}
        model={model}
        factory={this.factory}
        onAction={this.Layout.action}
        onRenderTab={this.Layout.renderTab}
        onModelChange={this.Model.change}
      />
    );
  }
}

export const installUi = async ({ document, workspace, sha, path }) => {
  await boot();
  ReactDOM.render(
    <App sha={'master'} workspace={'JSxCAD'} path={path} />,
    document.getElementById('container')
  );
};
