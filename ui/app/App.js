/* global */

import * as PropTypes from 'prop-types';

import { addVoxel, getWorldPosition } from '@jsxcad/ui-threejs';

import {
  appendViewGroupCode,
  deleteViewGroupCode,
  extractViewGroupCode,
  rewriteViewGroupOrient,
  rewriteVoxels,
} from '@jsxcad/compiler';

import {
  askService,
  ask as askSys,
  boot,
  clearEmitted,
  deleteFile,
  getActiveServices,
  listFiles,
  log,
  read,
  resolvePending,
  terminateActiveServices,
  touch,
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
import ListGroup from 'react-bootstrap/ListGroup';
import OrbitView from './OrbitView.js';
import Prettier from 'https://unpkg.com/prettier@2.3.2/esm/standalone.mjs';
import PrettierParserBabel from 'https://unpkg.com/prettier@2.3.2/esm/parser-babel.mjs';
import React from 'react';
import ReactDOM from 'react-dom';
import Row from 'react-bootstrap/Row';
import { animationFrame } from './schedule.js';
import { execute } from '@jsxcad/api';

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
          id: 'GC',
          type: 'tab',
          name: 'GC',
          component: 'GC',
          enableClose: false,
          borderWidth: 1024,
        },
        {
          id: 'Log',
          type: 'tab',
          name: 'Log',
          component: 'Log',
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
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { sha, workspace } = this.props;

    this.agent = async ({ ask, message, type }) => {
      const {
        op,
        entry,
        id,
        identifier,
        notes,
        options,
        path,
        sourceLocation,
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
                domElement.appendChild(domElementByHash.get(entry.hash));
              } else {
                // We need to build the element.
                if (entry.view && !entry.url) {
                  const { path, view } = entry;
                  const { width, height } = view;
                  const canvas = document.createElement('canvas');
                  canvas.width = width;
                  canvas.height = height;
                  const offscreenCanvas = canvas.transferControlToOffscreen();
                  const render = async () => {
                    try {
                      console.log(`Ask render for ${path}/${id}`);
                      const url = await this.ask(
                        {
                          op: 'staticView',
                          path,
                          workspace,
                          view,
                          offscreenCanvas,
                        },
                        { path },
                        [offscreenCanvas]
                      );
                      console.log(`Finished render for ${path}/${id}`);
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
                  console.log(`Schedule render for ${path}/${id}`);
                  render();
                }

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
                domElement.appendChild(element);
                console.log(`Marking ${entry.hash} in ${path}/${id}`);
              }
            }

            await animationFrame();

            notebookDefinitions[id] = {
              notes,
              domElement,
            };

            if (NotebookAdvice.onUpdate) {
              await NotebookAdvice.onUpdate();
            }
          }
          return;
        case 'info':
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
      const { Clipboard } = this.state;
      this.setState({ Clipboard: { ...Clipboard, code: data } });
    };

    this.Clipboard.run = () => {};

    this.Clipboard.save = () => {};

    this.GC = {};

    this.GC.delete = async () => {
      const { WorkspaceFiles } = this.state;
      const regenerableFiles = WorkspaceFiles.filter((file) =>
        isRegenerable(file)
      );
      for (const file of regenerableFiles) {
        console.log(`QQ/Deleting: ${file}`);
        await deleteFile({ workspace }, file);
      }
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

    this.Layout.renderTab = (tabNode, { buttons }) => {
      const id = tabNode.getId();
      if (id.startsWith('Notebook/')) {
        const path = id.substring(9);
        buttons.push(
          <span
            id={`Spinners/${id}`}
            dangerouslySetInnerHTML={this.Layout.buildSpinners(path)}
          />
        );
      }
    };

    this.Log = {};

    this.Log.clear = async () => {
      this.updateState({ LogMessages: [] });
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
      // Now that layout is in place, run the notebooks we just loaded.
      for (const path of WorkspaceOpenPaths) {
        await this.Notebook.run(path);
      }
    };

    this.Notebook = {};

    this.Notebook.clickView = async ({ path, view, sourceLocation }) => {
      const { model } = this.state;
      await this.updateState({ View: { path, view, sourceLocation } });
      // This is a bit of a hack, since selectTab toggles.
      model.getNodeById('View').getParent()._setSelected(-1);
      model.doAction(FlexLayout.Actions.selectTab('View'));
      this.View.store();
    };

    this.Notebook.clickMake = async ({ path, id, sourceLocation }) => {
      await this.updateState({ Make: { path, id, sourceLocation } });
    };

    this.Notebook.run = async (path, options) => {
      const { sha, workspace } = this.props;
      const NotebookAdvice = this.Notebook.ensureAdvice(path);
      const NotebookPath = path;
      const topLevel = new Map();
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

        let script = NotebookText;
        const evaluate = async (script) => {
          try {
            const result = await this.ask(
              {
                op: 'evaluate',
                script,
                workspace,
                path: NotebookPath,
                sha,
              },
              { path }
            );
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
            const result = await this.ask(
              {
                op: 'evaluate',
                script,
                workspace,
                path: NotebookPath,
                sha,
              },
              { path }
            );
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
        NotebookAdvice.definitions = topLevel;
        await execute(script, {
          evaluate,
          replay,
          path: NotebookPath,
          topLevel,
        });
        await resolvePending();
      } catch (error) {
        // Include any high level notebook errors in the output.
        window.alert(error.stack);
      } finally {
        await this.updateState({ NotebookState: 'idle' });
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

      // Automatically run the notebook on load. The user can hit Stop.
      // await this.Notebook.run(path);
    };

    this.Notebook.save = async (path) => {
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
      const cleanText = getCleanText(NotebookText);
      await write(NotebookFile, new TextEncoder('utf8').encode(cleanText), {
        workspace,
      });
      await this.updateState({ [`NotebookText/${path}`]: cleanText });

      // Let state propagate.
      await animationFrame();

      return cleanText;
    };

    this.Notebook.change = (path, data) => {
      this.setState({ [`NotebookText/${path}`]: data });
    };

    this.Notebook.clickLink = async (path, link) => {
      const { model } = this.state;
      await this.Workspace.loadWorkingPath(link);
      // This is a bit of a hack, since selectTab toggles.
      const nodeId = `Notebook/${link}`;
      model.getNodeById(nodeId).getParent()._setSelected(-1);
      model.doAction(FlexLayout.Actions.selectTab(nodeId));
      this.View.store();
    };

    this.Notebook.close = async (closedPath) => {
      const { WorkspaceOpenPaths = [] } = this.state;
      await this.updateState({
        [`NotebookText/${closedPath}`]: undefined,
        [`NotebookAdvice/${closedPath}`]: undefined,
        WorkspaceOpenPaths: WorkspaceOpenPaths.filter(
          (path) => path !== closedPath
        ),
      });
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

    this.View = {};

    this.View.click = async ({
      camera,
      draggableObjects,
      editId,
      editType,
      object,
      trackballControls,
      position,
      ray,
      renderer,
      scene,
      sourceLocation,
      type,
      target,
      threejsMesh,
      viewId,
    }) => {
      if (this.View.updating) {
        return;
      }
      try {
        this.View.updating = true;
        switch (editType) {
          case 'Group': {
            /*
            let changeScheduled = false;
            let at, to, up;
            const change = async () => {
              changeScheduled = false;
              const request = {
                viewId,
                nth: object.userData.groupChildId,
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
              const newNotebookText = rewriteViewGroupOrient(
                NotebookText,
                request
              );
              await this.updateState({
                [`NotebookText/${path}`]: newNotebookText,
              });
            };
            ({ at, to, up } = addAnchors({
              camera,
              draggableObjects,
              editId,
              editType,
              object,
              onObjectChange: () => {
                if (!changeScheduled) {
                  changeScheduled = true;
                  setTimeout(change, 500);
                }
              },
              position,
              ray,
              renderer,
              scene,
              sourceLocation,
              type,
              target,
              threejsMesh,
              trackballControls,
              viewState: this.View.state,
            }));
*/
            return;
          }
          case 'Voxels': {
            const { path } = sourceLocation;
            const { [`NotebookText/${path}`]: NotebookText } = this.state;
            const request = { editId };
            const [point, normal] = ray;
            switch (type) {
              case 'left':
                request.pointToAppend = [
                  point[0] + normal[0] / 2,
                  point[1] + normal[1] / 2,
                  point[2] + normal[2] / 2,
                ].map((v) => Math.round(v));
                break;
              case 'right':
                request.pointToRemove = [
                  point[0] - normal[0] / 2,
                  point[1] - normal[1] / 2,
                  point[2] - normal[2] / 2,
                ].map((v) => Math.round(v));
                break;
            }
            const newNotebookText = rewriteVoxels(NotebookText, request);
            await this.updateState({
              [`NotebookText/${path}`]: newNotebookText,
            });
            // Add an voxel to the display to temporarily reflect what we added to the source.
            if (request.pointToAppend) {
              addVoxel({
                editId,
                point: request.pointToAppend,
                scene,
                threejsMesh,
              });
            }
            await this.Notebook.run(path);
          }
        }
      } finally {
        this.View.updating = false;
      }
    };

    this.View.jogPendingUpdate = null;

    this.View.jog = async (update) => {
      const execute = async () => {
        const { sourceLocation, at, to, up, object } =
          this.View.jogPendingUpdate;
        const { viewId, groupChildId } = object.userData;
        try {
          this.View.jogPendingUpdate = null;
          const request = {
            viewId,
            nth: groupChildId,
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
        } finally {
          if (this.View.jogPendingUpdate) {
            setTimeout(execute, 500);
          }
        }
      };
      if (!this.View.jogPendingUpdate) {
        setTimeout(execute, 500);
      }
      this.View.jogPendingUpdate = update;
    };

    this.View.keydown = async ({ event, object, sourceLocation }) => {
      switch (event.key) {
        // Edit shape
        case ' ':
          window.alert('Edit');
          break;

        case 'Backspace':
        case 'Delete': {
          const { path } = sourceLocation;
          const { [`NotebookText/${path}`]: NotebookText } = this.state;
          const { viewId, groupChildId: nth } = object.userData;
          const newNotebookText = deleteViewGroupCode(NotebookText, {
            viewId,
            nth,
          });
          await this.updateState({
            [`NotebookText/${path}`]: newNotebookText,
          });
          await this.Notebook.run(path);
          break;
        }

        case 'c':
          if (!event.getModifierState('Control')) {
            break;
          }
        // fall through to Copy
        case 'Copy': {
          const { path } = sourceLocation;
          const { [`NotebookText/${path}`]: NotebookText } = this.state;
          const { viewId, groupChildId: nth } = object.userData;
          const { code } = extractViewGroupCode(NotebookText, { viewId, nth });
          await this.updateState({ Clipboard: { path, code, viewId, nth } });
          break;
        }

        case 'x':
          if (!event.getModifierState('Control')) {
            break;
          }
        // fall through to Cut
        case 'Cut': {
          const { path } = sourceLocation;
          const { [`NotebookText/${path}`]: NotebookText } = this.state;
          const { viewId, groupChildId: nth } = object.userData;
          const { code } = extractViewGroupCode(NotebookText, { viewId, nth });
          const newNotebookText = deleteViewGroupCode(NotebookText, {
            viewId,
            nth,
          });
          await this.updateState({
            [`NotebookText/${path}`]: newNotebookText,
            Clipboard: { code, viewId },
          });
          await this.Notebook.run(path);
          break;
        }

        case 'v':
          if (!event.getModifierState('Control')) {
            break;
          }
        // fall through to Paste
        case 'Paste': {
          const { path } = sourceLocation;
          const { Clipboard = {}, [`NotebookText/${path}`]: NotebookText } =
            this.state;
          const { code, viewId } = Clipboard;
          if (!code) {
            return;
          }
          const newNotebookText = appendViewGroupCode(NotebookText, {
            viewId,
            code,
          });
          await this.updateState({
            [`NotebookText/${path}`]: newNotebookText,
          });
          await this.Notebook.run(path);
          break;
        }
      }
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
      const { WorkspaceOpenPaths = [] } = this.state;
      if (WorkspaceOpenPaths.includes(path)) {
        // FIX: Add indication?
        return;
      }
      await this.updateState({
        WorkspaceOpenPaths: [...WorkspaceOpenPaths, path],
      });
      await this.Notebook.load(path);
      this.layoutRef.current.addTabToTabSet('Notebooks', {
        id: `Notebook/${path}`,
        type: 'tab',
        name: path,
        component: 'Notebook',
      });
      await this.Workspace.store();
      await this.Notebook.run(path);
    };

    this.Workspace.openWorkingFile = async (file) => {
      const { WorkspaceOpenPaths = [] } = this.state;
      const path = file.substring(7);
      if (WorkspaceOpenPaths.includes(path)) {
        // FIX: Add indication?
        return;
      }
      await this.updateState({
        WorkspaceOpenPaths: [...WorkspaceOpenPaths, path],
      });
      await this.Notebook.load(path);
      this.layoutRef.current.addTabToTabSet('Notebooks', {
        id: `Notebook/${path}`,
        type: 'tab',
        name: path,
        component: 'Notebook',
      });
      await this.Workspace.store();
      await this.Notebook.run(path);
    };

    this.Workspace.store = async () => {
      if (this.Workspace.saving) {
        return;
      }
      try {
        this.Model.saving = true;
        const { workspace } = this.props;
        const { WorkspaceOpenPaths } = this.state;
        const config = {
          WorkspaceOpenPaths,
        };
        await write('config/Workspace', config, { workspace });
      } finally {
        this.Workspace.saving = false;
      }
    };

    this.Workspace.restore = async () => {
      // We restore these via Model.restore.
    };

    this.factory = (node) => {
      switch (node.getComponent()) {
        case 'Workspace': {
          const { WorkspaceFiles, WorkspaceOpenPaths = [] } = this.state;
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
                          <Form.Group controlId="WorkspaceLoadPathId">
                            <Form.Control placeholder="URL or Path" />
                          </Form.Group>
                        </Col>
                        <Col xs="auto">
                          <Button
                            variant="primary"
                            onClick={() => {
                              const pathControl = document.getElementById(
                                'WorkspaceLoadPathId'
                              );
                              const path = pathControl.value;
                              this.Workspace.loadWorkingPath(path);
                            }}
                          >
                            Add
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
          const path = node.getName();
          const { [`NotebookText/${path}`]: NotebookText } = this.state;
          const NotebookAdvice = this.Notebook.ensureAdvice(path);
          return (
            <JsEditorUi
              onRun={() => this.Notebook.run(path)}
              onSave={() => this.Notebook.save(path)}
              onChange={(data) => this.Notebook.change(path, data)}
              onClickLink={(link) => this.Notebook.clickLink(path, link)}
              onClose={() => this.Notebook.close(path)}
              data={NotebookText}
              advice={NotebookAdvice}
            />
          );
        }
        case 'Clipboard': {
          const { Clipboard = {} } = this.state;
          const { code } = Clipboard;
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
              onJog={this.View.jog}
              onKeydown={this.View.keydown}
              onMove={this.View.move}
              trackballState={trackballState}
            />
          );
        }
        case 'GC': {
          const { WorkspaceFiles } = this.state;
          return (
            <div>
              <Card>
                <Card.Body>
                  <Card.Title>Garbage Collection</Card.Title>
                  <Card.Text>
                    <Button variant="primary" onClick={this.GC.delete}>
                      Delete
                    </Button>
                    <ListGroup>
                      {WorkspaceFiles.filter((file) => isRegenerable(file)).map(
                        (file, index) => (
                          <ListGroup.Item key={index} disabled>
                            {file}
                          </ListGroup.Item>
                        )
                      )}
                    </ListGroup>
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
          const { LogMessages = [] } = this.state;
          return (
            <div>
              <Card>
                <Card.Body>
                  <Card.Title>Log Messages</Card.Title>
                  <Card.Text>
                    <Button variant="primary" onClick={this.Log.clear}>
                      Clear
                    </Button>
                    <ListGroup>
                      {LogMessages.map(({ type, source, text }, index) => (
                        <ListGroup.Item key={index} disabled>
                          {text}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
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

    this.logUpdater = ({ type, source, text }) => {
      this.Log.pendingMessages.unshift({ type, source, text });
      if (this.Log.updating) {
        return;
      }
      const spool = async () => {
        try {
          while (this.Log.pendingMessages.length > 0) {
            const commit = this.Log.pendingMessages;
            this.Log.pendingMessages = [];
            const { LogMessages = [] } = this.state;
            await this.updateState({
              LogMessages: [...commit, ...LogMessages],
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
        servicesActiveCounts[context.path] += 1;
      }
      this.servicesActiveCounts = servicesActiveCounts;
      console.log(`QQ/SAC: ${JSON.stringify(this.servicesActiveCounts)}`);
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
      const [workspace, path] = hash.split('@');
      console.log({ workspace, path });
      this.Notebook.clickLink(undefined, path);
    };

    this.servicesActiveCounts = {};

    await this.Workspace.restore();
    await this.View.restore();
    await this.Model.restore();
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

export const installUi = async ({ document, workspace, sha }) => {
  await boot();
  ReactDOM.render(
    <App sha={'master'} workspace={'JSxCAD'} />,
    document.getElementById('container')
  );
};
