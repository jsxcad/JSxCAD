/* global FileReader, showDirectoryPicker */

import './react-flexlayout.css';
import './react-multi-split-pane.css';

import * as PropTypes from 'prop-types';

import api, { execute } from '@jsxcad/api';

import {
  askService,
  ask as askSys,
  boot,
  clearCacheDb,
  clearEmitted,
  getActiveServices,
  getLocalFilesystems,
  listFiles,
  log,
  logInfo,
  read,
  readOrWatch,
  remove,
  resolvePending,
  setConfig,
  setLocalFilesystems,
  setupWorkspace,
  terminateActiveServices,
  watchFileCreation,
  watchFileDeletion,
  watchLog,
  watchServices,
  write,
} from '@jsxcad/sys';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import DynamicView from './DynamicView.js';
import EditNote from './EditNote.js';
import FlexLayout from 'flexlayout-react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import JsEditorUi from './JsEditorUi.js';
import ListGroup from 'react-bootstrap/ListGroup';
import { MakeEspWebUi } from './Make.js';
import Notebook from './Notebook.js';
import Prettier from 'https://unpkg.com/prettier@2.3.2/esm/standalone.mjs';
import PrettierParserBabel from 'https://unpkg.com/prettier@2.3.2/esm/parser-babel.mjs';
import React from 'react';
import ReactDOM from 'react-dom';
import Row from 'react-bootstrap/Row';
import SplitPaneModule from 'react-multi-split-pane';
import Table from 'react-bootstrap/Table';
import TableOfContents from './TableOfContents.js';
import { animationFrame } from './schedule.js';
import { getCnc } from './Cnc.js';
import { getNotebookControlData } from '@jsxcad/ui-notebook';
import { render as renderSheetStorageCard } from './SheetStorage.js';
import { toEcmascript } from '@jsxcad/compiler';

const { SplitPane } = SplitPaneModule;

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
      weight: 200,
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
          weight: 300,
          enableDeleteWhenEmpty: false,
          component: 'Make',
          config: {
            model: {
              global: {
                tabSetTabLocation: 'top',
              },
              borders: [],
              layout: {
                type: 'row',
                id: 'Make/Tabs',
                children: [
                  {
                    type: 'tabset',
                    id: 'Make/Tabset',
                    children: [
                      {
                        id: 'Make/Tabset/Tab',
                        type: 'tab',
                        name: '+',
                        component: 'Make/Tabset/Tab',
                      },
                    ],
                  },
                ],
              },
            },
          },
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
    {
      type: 'border',
      location: 'right',
      weight: 50,
      children: [
        {
          id: 'ToC',
          type: 'tab',
          name: 'ToC',
          component: 'ToC',
          enableClose: false,
          borderWidth: 64,
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
        weight: 300,
        enableDeleteWhenEmpty: false,
        children: [
          {
            id: 'Notebook/https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/index.nb',
            type: 'tab',
            name: 'index.nb',
            component: 'Notebook',
          },
        ],
      },
      {
        id: 'Drafts',
        type: 'tabset',
        weight: 100,
        enableDeleteWhenEmpty: false,
        children: [
          {
            id: 'Draft',
            type: 'tab',
            name: 'Draft',
            component: 'Draft',
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
      // const { op, entry, identifier, notes, options, path, sourceLocation } =
      const { op, entry, identifier, options, path } = message;
      switch (op) {
        case 'ask':
          return askSys(identifier, options);
        case 'deleteFile':
          return remove(path, options);
        case 'log':
          return log(entry);
        case 'notes':
          break;
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
    this.makeLayoutRef = React.createRef();

    this.Draft = {};

    this.Draft.append = (data) => {
      this.Draft.change(this.Draft.getCode() + data);
    };

    this.Draft.change = (data) => {
      const { Draft = {} } = this.state;
      if (Draft.code !== data) {
        console.log(`QQ/Draft.change: ${Draft.code} to ${data}`);
        return this.setState({ Draft: { ...Draft, code: data } });
      }
    };

    this.Draft.getCode = (data) => {
      const { Draft = {} } = this.state;
      const { code = '' } = Draft;
      return code;
    };

    this.Draft.run = () => {};

    this.Draft.save = () => {};

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

    this.Notebook.clickMake = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const { model } = this.state;
      // This is a bit of a hack, since selectTab toggles.
      model.getNodeById('Make').getParent()._setSelected(-1);
      model.doAction(FlexLayout.Actions.selectTab('Make'));
      await animationFrame();
    };

    this.Notebook.updateSections = async (path, workspace) => {
      const { sha } = this.props;
      const notebookFile = `source/${path}`;
      const topLevel = new Map();
      const updates = {};
      const replays = {};
      const exports = [];
      const data = await read(notebookFile, { workspace });
      const script =
        typeof data === 'string' ? data : new TextDecoder('utf8').decode(data);
      const sections = new Map();
      try {
        await toEcmascript(script, {
          api: { ...api, sha },
          exports,
          path,
          replays,
          topLevel,
          updates,
          workspace,
        });
      } catch (error) {
        // FIX: Report this error properly.
        console.log(error.stack);
        sections.set('$', {
          source: script,
          controls: [],
          downloads: [],
          errors: [],
          mds: [],
          views: [],
        });
        await this.updateState({
          [`NotebookSections/${path}`]: sections,
        });
        return;
      }
      for (const [id, { text }] of topLevel) {
        const {
          controls = [],
          downloads = [],
          errors = [],
          mds = [],
          views = [],
        } = await read(`section/${path}/${id}`, { workspace, otherwise: {} });
        sections.set(id, {
          source: text,
          controls,
          downloads,
          errors,
          mds,
          views,
        });
      }
      await this.updateState({
        [`NotebookSections/${path}`]: sections,
      });
    };

    this.Notebook.updateSection = async (path, id, section) => {
      const { workspace } = this.props;

      if (id === undefined) {
        return;
      }

      const {
        [`NotebookSections/${path}`]: NotebookSections = new Map(),
        [`NotebookVersion/${path}`]: NotebookVersion = 0,
      } = this.state;

      for (const view of section.views) {
        await this.Notebook.ensureThumbnail(view);
      }

      // How will this trigger an update?
      NotebookSections.set(id, {
        source: NotebookSections.get(id).source,
        ...section,
      });

      await write(`section/${path}/${id}`, section, { workspace });

      await this.updateState({
        [`NotebookVersion/${path}`]: NotebookVersion + 1,
      });
    };

    this.Notebook.ensureThumbnail = async (note) => {
      if (!note.url) {
        const loadThumbnail = async () => {
          let url = await (note.needsThumbnail ? read : readOrWatch)(
            note.view.thumbnailPath,
            {
              workspace,
            }
          );
          if (!url) {
            const { path, view } = note;
            const { width, height } = view;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const offscreenCanvas = canvas.transferControlToOffscreen();
            for (let nth = 0; nth < 3; nth++) {
              try {
                console.log(`QQ/ask staticView nth=${nth}`);
                url = await this.ask(
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
                // Cache the thumbnail for next time.
                await write(`thumbnail/${note.hash}`, url, {
                  workspace,
                });
                note.url = url;
              } catch (error) {
                if (error.message === 'Terminated') {
                  // Try again.
                  continue;
                }
              }
            }
          }
          if (url) {
            note.url = url;
          }
        };
        await loadThumbnail();
      }
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

    this.Notebook.getText = (path) => {
      const {
        [`NotebookSections/${path}`]: NotebookSections = new Map(),
        [`NotebookText/${path}`]: NotebookText = '',
      } = this.state;

      // Ideally we would use a topographical sort here.

      const statements = [...NotebookSections.values()].map(
        ({ source }) => source
      );

      if (statements.length === 0) {
        // Note: bootstrapping.
        return NotebookText;
      }

      return statements.join('\n\n');
    };

    this.Notebook.run = async (path, options) => {
      const { LocalFilesystemHandles = [] } = this.state;
      for (const [, handle] of LocalFilesystemHandles) {
        if ((await handle.queryPermission({ mode: 'read' })) === 'granted') {
          continue;
        }
        await handle.requestPermission({ mode: 'read' });
      }
      if (this.Notebook.runDebounce) {
        return;
      }
      try {
        this.Notebook.runDebounce = true;
        const sleep = (duration) =>
          new Promise((resolve, reject) => setTimeout(resolve, duration));
        // Give time for bounce.
        await sleep(0.1);
      } finally {
        this.Notebook.runDebounce = false;
      }
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
      // await blurNotebookState(this, { path, workspace });
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
        await this.updateState({
          [`NotebookState/${NotebookPath}`]: 'running',
        });
        // Terminate any services running for this path, since we're going to restart evaluating it.
        await terminateActiveServices((context) => context.path === path);
        // CHECK: Can we get rid of this?
        clearEmitted();

        const NotebookText = await this.Notebook.save(path);

        if (!NotebookPath.endsWith('.js') && !NotebookPath.endsWith('.nb')) {
          // We don't know how to run anything else.
          return;
        }

        let script = NotebookText;

        const version = new Date().getTime();

        const evaluate = async (script, { id }) => {
          try {
            await this.setState((state) => ({
              WorkerState: {
                ...state.WorkerState,
                [`${path}/${id}`]: 'running',
              },
            }));
            // console.log(`Running: ${path}/${id}: ${JSON.stringify( this.state.WorkerState)}`);
            const section = await this.ask(
              {
                op: 'app/evaluate',
                path: NotebookPath,
                script,
                sha,
                version,
                workspace,
              },
              { path }
            );
            if (section === undefined) {
              // The error will have come back via a note.
              throw Error('Evaluation failed');
            }
            if (section.profile) {
              updateProfile(section.profile);
            }
            await this.Notebook.updateSection(path, id, section);
            return section;
          } catch (error) {
            throw error;
          } finally {
            await this.setState((state) => ({
              WorkerState: { ...state.WorkerState, [`${path}/${id}`]: 'done' },
            }));
            // console.log(`Done: ${JSON.stringify(this.state.WorkerState)}`);
          }
        };

        const replay = async (script) => {
          // FIX: Remove this, since it doesn't get used anymore.
          try {
            const result = await this.ask(
              {
                op: 'app/evaluate',
                script,
                workspace,
                path: NotebookPath,
                sha,
                version,
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

        try {
          await execute(script, {
            api: { ...api, sha },
            evaluate,
            replay,
            path: NotebookPath,
            topLevel,
            workspace,
          });
        } catch (error) {
          console.log(error.stack);
          throw error;
        }

        // A bit of a race condition here.
        this.Draft.change('');

        await resolvePending();
      } catch (error) {
        // Include any high level notebook errors in the output.
        window.alert(error.stack);
      } finally {
        await this.updateState({ [`NotebookState/${NotebookPath}`]: 'idle' });
        logInfo('app/App', `Completed notebook run ${path}`);
        logProfile();
      }
    };

    this.Notebook.load = async (path) => {
      const { workspace } = this.props;
      const notebookPath = path;
      const notebookFile = `source/${notebookPath}`;
      await ensureFile(notebookFile, notebookPath, { workspace });
      await this.Notebook.updateSections(path, workspace);

      // Let state propagate.
      await animationFrame();
    };

    this.Notebook.save = async (path) => {
      logInfo('app/App/Notebook/save', `Saving Notebook ${path}`);
      const { workspace } = this.props;
      const NotebookText =
        this.Notebook.getText(path) + '\n\n' + this.Draft.getCode();
      // const { [`NotebookText/${path}`]: NotebookText } = this.state;
      const NotebookPath = path;
      const NotebookFile = `source/${NotebookPath}`;
      const getCleanText = (data) => {
        if (NotebookPath.endsWith('.js') || NotebookPath.endsWith('.nb')) {
          // Just make a best attempt to reformat.
          try {
            data = Prettier.format(NotebookText, {
              trailingComma: 'es5',
              singleQuote: true,
              parser: 'babel',
              plugins: [PrettierParserBabel],
            });
          } catch (error) {
            console.log(error);
            throw error;
          }
        }
        return data;
      };
      logInfo('app/App/Notebook/save', `Cleaning Notebook ${path}`);
      const cleanText = getCleanText(NotebookText);
      logInfo('app/App/Notebook/save', `Writing Notebook ${path}`);
      await write(NotebookFile, new TextEncoder('utf8').encode(cleanText), {
        workspace,
      });
      await this.Notebook.updateSections(path, workspace);
      logInfo('app/App/Notebook/save', `Updating state for Notebook ${path}`);
      await this.updateState({ [`NotebookText/${path}`]: cleanText });

      // Let state propagate.
      await animationFrame();

      logInfo('app/App/Notebook/save', `Saving complete for ${path}`);
      return cleanText;
    };

    this.Notebook.cycleMode = async (path) => {
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
    };

    this.Notebook.change = (path, data, id) => {
      this.setState({ [`NotebookText/${path}`]: data });
    };

    this.Notebook.selectLine = async (path, line) => {
      await this.updateState({
        [`NotebookLine/${path}`]: line,
      });
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

    this.Notebook.updateAdvice = (path, advice) => {
      const key = `NotebookAdvice/${path}`;
      this.setState({ [key]: { ...advice } });
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

    this.View.click = ({ object, ray }) => {
      console.log(`QQ/View/click: ${JSON.stringify(ray)}`);
    };

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
          this.Draft.change(``);
          break;
        }
        case 1: {
          this.Draft.change(`const ${editId} = ${ops[0]};`);
          break;
        }
        default: {
          this.Draft.change(`const ${editId} = Group(${ops.join(', ')});`);
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
      if (View) {
        await write('config/View', View, { workspace });
      }
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

    this.Workspace.getSelectedPaths = (path) => {
      const selectedPaths = [];
      for (const input of document.querySelectorAll('input:checked')) {
        if (!input.id.startsWith('WorkspaceSelect/')) {
          continue;
        }
        const file = input.id.substring('WorkspaceSelect/'.length);
        selectedPaths.push(file);
      }
      return selectedPaths;
    };

    this.Workspace.loadWorkingPath = async (path) => {
      const {
        model,
        WorkspaceOpenPaths = [],
        // [`NotebookMode/${path}`]: mode,
      } = this.state;
      if (WorkspaceOpenPaths.includes(path)) {
        // FIX: Add indication?
        return;
      }
      await this.updateState({
        WorkspaceOpenPaths: [...WorkspaceOpenPaths, path],
      });
      await this.Notebook.load(path);
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

    this.Workspace.setLocalFilesystem = async (prefix, handle) => {
      const { LocalFilesystemHandles = new Map() } = this.state;
      const updatedLocalFilesystemHandles = new Map(LocalFilesystemHandles);
      if (handle === undefined) {
        updatedLocalFilesystemHandles.delete(prefix);
      } else {
        updatedLocalFilesystemHandles.set(prefix, handle);
      }
      setLocalFilesystems(updatedLocalFilesystemHandles);
      await this.updateState({
        LocalFilesystemHandles: updatedLocalFilesystemHandles,
      });
      await this.Workspace.store();
    };

    this.Workspace.openWorkingFile = async (file) => {
      const path = file.substring('source/'.length);
      await this.Notebook.clickLink(path);
    };

    this.Workspace.closeWorkingFile = async (file) => {
      const path = file.substring('source/'.length);
      await this.Notebook.close(path);
    };

    this.Workspace.revertWorkingFile = async (file) => {
      await this.Workspace.closeWorkingFile(file);
      await remove(file, { workspace });
    };

    this.Workspace.store = async () => {
      if (this.Workspace.saving) {
        return;
      }
      try {
        this.Model.saving = true;
        const { workspace } = this.props;
        const {
          LocalFilesystemHandles,
          WorkspaceOpenPaths,
          WorkspaceLoadPath,
          WorkspaceLoadPrefix,
        } = this.state;
        const config = {
          LocalFilesystemHandles,
          WorkspaceOpenPaths,
          WorkspaceLoadPath,
          WorkspaceLoadPrefix,
        };
        await write('config/Workspace', config, { workspace });
      } finally {
        this.Workspace.saving = false;
      }
    };

    this.Workspace.reset = async () => {
      const { workspace } = this.props;
      await remove('config/Workspace', { workspace });
      await this.Workspace.restore();
    };

    this.Workspace.restore = async () => {
      const { workspace } = this.props;
      // We restore WorkspaceOpenPaths via Model.restore.
      const {
        LocalFilesystemHandles = new Map(),
        WorkspaceLoadPath,
        WorkspaceLoadPrefix = 'https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/',
      } = await read('config/Workspace', { workspace, otherwise: {} });
      for (const [key, value] of [...LocalFilesystemHandles]) {
        if (key === undefined || typeof value === 'string') {
          LocalFilesystemHandles.delete(key);
        }
      }
      await this.updateState({
        LocalFilesystemHandles,
        WorkspaceLoadPath,
        WorkspaceLoadPrefix,
      });
      setLocalFilesystems(LocalFilesystemHandles);
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
      const selectedPaths = this.Workspace.getSelectedPaths();
      const isSelectedPath = (path) =>
        selectedPaths.length === 0 || selectedPaths.includes(path);
      for (const path of WorkspaceFiles) {
        if (path.startsWith(sourcePrefix) && isSelectedPath(path)) {
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

    const onCodeChange = (path, id, code) => {
      const { [`NotebookSections/${path}`]: NotebookSections = new Map() } =
        this.state;
      NotebookSections.get(id).source = code;
    };

    const runGcode = async ({ e, path, data, workspace }) => {
      const { model } = this.state;
      await this.Notebook.clickMake(e);
      // Find the active Cnc (if any).
      const makeNode = model.getNodeById('Make');
      const subModel = makeNode.getExtraData().model;
      const tabsetNode = subModel.getNodeById('Make/Tabset');
      const selected = tabsetNode.getSelected();
      if (selected === -1) {
        return;
      }
      const tabNode = tabsetNode.getChildren()[selected];
      if (tabNode.id === 'Make/Tabset/Tab') {
        return;
      }
      const { ip, type } = tabNode.getConfig();
      const cnc = getCnc({ ip, type });
      if (path && !data) {
        data = await readOrWatch(path, { workspace });
      }
      await cnc.uploadAndRun(data);
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
          const isOpen = (file) =>
            WorkspaceOpenPaths.includes(file.substring(7));
          const computeListItemVariant = (file) =>
            isOpen(file) ? 'primary' : 'secondary';
          const prefix = `source/${WorkspaceLoadPrefix}`;
          const localFilesystemEntries = [];
          for (const [prefix] of getLocalFilesystems()) {
            if (prefix === undefined) {
              continue;
            }
            localFilesystemEntries.push(
              <Button onClick={() => this.Workspace.setLocalFilesystem(prefix)}>
                Remove {prefix}
              </Button>
            );
          }
          return (
            <div>
              <Card>
                <Card.Body>
                  <Card.Title>Set Base Path</Card.Title>
                  <Card.Text>
                    <Form>
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
                      </Form.Group>
                    </Form>
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Select Paths</Card.Title>
                  <Card.Text>
                    <Form>
                      <ListGroup>
                        {WorkspaceFiles.filter((file) =>
                          file.startsWith(prefix)
                        ).map((file, index) => (
                          <ListGroup.Item key={index}>
                            <ButtonGroup
                              variant={computeListItemVariant(file)}
                              key={index}
                            >
                              <InputGroup.Checkbox
                                key={index}
                                type="checkbox"
                                id={`WorkspaceSelect/${file}`}
                              />
                              <Button
                                variant={computeListItemVariant(file)}
                                key={index}
                                action
                                active={false}
                                onClick={(event) => {
                                  event.target.blur();
                                  if (isOpen(file)) {
                                    this.Workspace.closeWorkingFile(file);
                                  } else {
                                    this.Workspace.openWorkingFile(file);
                                  }
                                }}
                              >
                                {file.substring(prefix.length)}
                              </Button>
                            </ButtonGroup>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Form>
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Export Selected Paths to Folder</Card.Title>
                  <Card.Text>
                    <Form>
                      <Button
                        onClick={() => {
                          const { WorkspaceLoadPrefix } = this.state;
                          this.Workspace.export(WorkspaceLoadPrefix);
                        }}
                        disabled={!WorkspaceLoadPrefix}
                      >
                        Export
                      </Button>
                    </Form>
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Revert Selected Paths</Card.Title>
                  <Card.Text>
                    <Form>
                      <Button
                        onClick={async (event) => {
                          for (const path of this.Workspace.getSelectedPaths()) {
                            this.Workspace.revertWorkingFile(path);
                          }
                        }}
                      >
                        Revert
                      </Button>
                    </Form>
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Import</Card.Title>
                  <Card.Text>
                    <Form>
                      <Form.Group controlId="WorkspaceLoadPathId">
                        <Form.Control
                          placeholder="Path (extending Base Path)"
                          onChange={(e) =>
                            this.updateState({
                              WorkspaceLoadPath: e.target.value,
                            })
                          }
                          value={WorkspaceLoadPath}
                        />
                        <Form.Text>Path</Form.Text>
                      </Form.Group>
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
                        Import or Open New
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
                        Upload from Computer
                      </Button>
                    </Form>
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Reset Workspace</Card.Title>
                  <Card.Text>
                    <Button variant="primary" onClick={this.Workspace.reset}>
                      Reset
                    </Button>
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Local Filesystem</Card.Title>
                  <Card.Text>
                    <Form>
                      <Form.Group>
                        <Form.Control
                          id="AddLocalFilesystemPrefix"
                          placeholder="Prefix"
                          value=""
                        />
                      </Form.Group>
                      <Button
                        variant="primary"
                        onClick={async () => {
                          const handle = await showDirectoryPicker();
                          this.Workspace.setLocalFilesystem(
                            document.getElementById('AddLocalFilesystemPrefix')
                              .value,
                            handle
                          );
                        }}
                      >
                        Add Local Filesystem
                      </Button>
                      {localFilesystemEntries}
                    </Form>
                  </Card.Text>
                </Card.Body>
              </Card>
              {renderSheetStorageCard()}
            </div>
          );
        }
        case 'Make': {
          try {
            let model = node.getExtraData().model;
            if (model == null) {
              node.getExtraData().model = FlexLayout.Model.fromJson(
                node.getConfig().model
              );
              model = node.getExtraData().model;
              // save submodel on save event
              node.setEventListener('save', (p) => {
                this.state.model.doAction(
                  FlexLayout.Actions.updateNodeAttributes(node.getId(), {
                    config: { model: node.getExtraData().model.toJson() },
                  })
                );
              });
            }
            return (
              <FlexLayout.Layout
                model={model}
                factory={this.factory}
                ref={this.makeLayoutRef}
                onModelChange={this.Model.change}
              />
            );
          } catch (error) {
            console.log(error.stack);
            return;
          }
        }
        case 'Make/Tabset/Tab': {
          const addMachine = (type) => {
            const name = document.getElementById('Make/Tabset/Tab/Name').value;
            const ip = document.getElementById('Make/Tabset/Tab/IP').value;
            const id = new Date().getTime();
            const nodeId = `Make/Tabset/Tab/${id}`;
            this.makeLayoutRef.current.addTabToTabSet('Make/Tabset', {
              id: nodeId,
              type: 'tab',
              name,
              component: `Make/Tabset/Tab/${type}`,
              config: { ip, type },
            });
          };
          return (
            <Form>
              <Form.Control id="Make/Tabset/Tab/Name" placeholder="name" />
              <Form.Control id="Make/Tabset/Tab/IP" placeholder="IP Address" />
              <Button onClick={() => addMachine('EspWebUi')}>
                Add ESP WebUI Machine
              </Button>
            </Form>
          );
        }
        case 'Make/Tabset/Tab/EspWebUi': {
          const { workspace } = this.props;
          const { View = {} } = this.state;
          const { ip } = node.getConfig();
          return (
            <MakeEspWebUi
              ip={ip}
              path={View.path}
              workspace={workspace}
            ></MakeEspWebUi>
          );
        }
        case 'Notebook': {
          const path = this.Notebook.getSelectedPath();
          const {
            [`NotebookMode/${path}`]: NotebookMode = 'view',
            [`NotebookText/${path}`]: NotebookText,
            [`NotebookNotes/${path}`]: NotebookNotes = {},
            [`NotebookSections/${path}`]: NotebookSections = new Map(),
            [`NotebookVersion/${path}`]: NotebookVersion = 0,
          } = this.state;
          const NotebookAdvice = this.Notebook.ensureAdvice(path);
          switch (NotebookMode) {
            case 'edit': {
              return (
                <SplitPane>
                  <Notebook
                    notebookPath={path}
                    notebookText={NotebookText}
                    onChange={onCodeChange}
                    onClickView={this.Notebook.clickView}
                    onKeyDown={(e) => this.onKeyDown(e)}
                    runGcode={(e) => runGcode(e)}
                    sections={NotebookSections}
                    version={NotebookVersion}
                    workspace={workspace}
                  />
                  <JsEditorUi
                    mode={NotebookMode}
                    onRun={() => this.Notebook.run(path)}
                    onSave={() => this.Notebook.save(path)}
                    onChange={(data) => this.Notebook.change(path, data)}
                    onClickLink={(path) => this.Notebook.clickLink(path)}
                    onCursorChange={(row) =>
                      this.Notebook.selectLine(path, row)
                    }
                    notes={NotebookNotes}
                    path={path}
                    data={NotebookText}
                    advice={NotebookAdvice}
                  />
                </SplitPane>
              );
            }
            default:
            case 'view': {
              return (
                <Notebook
                  notebookPath={path}
                  notebookText={NotebookText}
                  onClickView={this.Notebook.clickView}
                  onChange={onCodeChange}
                  onKeyDown={(e) => this.onKeyDown(e)}
                  runGcode={(e) => runGcode(e)}
                  sections={NotebookSections}
                  version={NotebookVersion}
                  workspace={workspace}
                />
              );
            }
          }
        }
        case 'ToC': {
          const path = this.Notebook.getSelectedPath();
          const {
            [`NotebookSections/${path}`]: NotebookSections = {},
            WorkerState = {},
          } = this.state;
          return (
            <TableOfContents
              path={path}
              sections={NotebookSections}
              state={WorkerState}
            />
          );
        }
        case 'Draft': {
          return (
            <EditNote
              notebookPath={this.Notebook.getSelectedPath()}
              key="$Draft"
              source={this.Draft.getCode()}
              onChange={(sourceText) => this.Draft.change(sourceText)}
              onKeyDown={(e) => this.onKeyDown(e)}
              workspace={workspace}
            />
          );
        }
        case 'View': {
          const { workspace } = this.props;
          const { View = {} } = this.state;
          return (
            <DynamicView
              path={View.path}
              onIndicatePoint={([
                x = 0,
                y = 0,
                z = 0,
                nx = 0,
                ny = 0,
                nz = 1,
              ]) =>
                navigator.clipboard.writeText(
                  `Ref(${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(
                    2
                  )}, ${nx.toFixed(2)}, ${ny.toFixed(2)}, ${nz.toFixed(2)})`
                )
              }
              view={View.view}
              workspace={workspace}
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
                  <Card.Title>(Advanced Interface)</Card.Title>
                  <Card.Text>
                    This provides lower level access to the internal filesystem.
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Clear Cached Files</Card.Title>
                  <Card.Text>
                    <Button
                      variant="primary"
                      onClick={this.Files.deleteCachedFiles}
                    >
                      Delete Temporary Files
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
          const { LogMessages = [], LogFilter = '' } = this.state;
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

    {
      const { WorkspaceFiles = [] } = this.state;

      for (const file of WorkspaceFiles) {
        console.log(`QQ/file: ${file}`);
      }
    }
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

    const saveControlValues = async (path, then) => {
      const { workspace } = this.props;
      const notebookControlData = await getNotebookControlData(path);
      await write(`control/${path}`, notebookControlData, {
        workspace,
      });
      // console.log(`QQ/saveControlValues: ${JSON.stringify(notebookControlData)}`);
      then(path);
    };

    const { ctrlKey, shiftKey } = e;
    switch (key) {
      case ENTER: {
        if (shiftKey) {
          e.preventDefault();
          e.stopPropagation();
          const path = this.Notebook.getSelectedPath();
          saveControlValues(path, this.Notebook.run);
          return false;
        }
        break;
      }
      case S: {
        if (ctrlKey) {
          e.preventDefault();
          e.stopPropagation();
          const path = this.Notebook.getSelectedPath();
          saveControlValues(path, this.Notebook.save);
          return false;
        }
        break;
      }
      case E: {
        if (ctrlKey) {
          e.preventDefault();
          e.stopPropagation();
          const path = this.Notebook.getSelectedPath();
          saveControlValues(path, this.Notebook.cycleMode);
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
  setupWorkspace('JSxCAD');
  await boot();
  ReactDOM.render(
    <App sha={'master'} workspace={'JSxCAD'} path={path} />,
    document.getElementById('container')
  );
};
