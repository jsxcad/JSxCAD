import './react-multi-split-pane.css';

import * as PropTypes from 'prop-types';

import {
  addOnEmitHandler,
  boot,
  decodeFiles,
  read,
  removeOnEmitHandler,
  resolvePending,
  setupWorkspace,
  write,
} from '@jsxcad/sys';

import DynamicView from './DynamicView.js';
import Notebook from './Notebook.js';
import React from 'react';
import ReactDOM from 'react-dom';
import SplitPaneModule from 'react-multi-split-pane';
import api from '@jsxcad/api';
import { dataUrl } from '@jsxcad/ui-threejs';
import { getNotebookControlData } from '@jsxcad/ui-notebook';

const { SplitPane } = SplitPaneModule;

class Standalone extends React.Component {
  static get propTypes() {
    return {
      baseUrl: PropTypes.string,
      files: PropTypes.object,
      module: PropTypes.string,
      workspace: PropTypes.string,
    };
  }

  async componentDidMount() {
    const { baseUrl, files, module, workspace } = this.props;

    const setVersion = (notes, version) => {
      for (const note of notes) {
        note.version = version;
      }
    };

    const renderViews = async (notes) => {
      for (const note of notes) {
        if (!note.view) {
          continue;
        }
        if (note.path && !note.data) {
          note.data = await read(note.path, { workspace });
        }
        if (note.data) {
          note.data = await note.data;
          if (!note.url) {
            note.url = await dataUrl(
              api.Shape.fromGeometry(note.data),
              note.view
            );
          }
        }
      }
    };

    const fixLinks = async (notes) => {
      for (const note of notes) {
        if (!note.md) {
          continue;
        }
        note.md = note.md.replace(
          /#https:[/][/]raw.githubusercontent.com[/]jsxcad[/]JSxCAD[/]master[/](.*?).nb/g,
          (_, modulePath) => baseUrl + '/' + modulePath + '.html'
        );
      }
    };

    const prepareDownloads = async (notes) => {
      for (const note of notes) {
        if (!note.download) {
          continue;
        }
        for (const entry of note.download.entries) {
          entry.data = await entry.data;
        }
      }
    };

    const run = async ({ isRerun = false } = {}) => {
      const version = new Date().getTime();
      const addNotes = async (notes) => {
        if (notes.length === 0) {
          return;
        }
        // const sourceLocation = notes[0].sourceLocation;
        // TODO: Parallelize these operations.
        setVersion(notes, version);
        await renderViews(notes);
        await fixLinks(notes);
        await prepareDownloads(notes);
        // updateNotebookState(this, { notes, sourceLocation, workspace });
      };

      const onEmitHandler = addOnEmitHandler(addNotes);

      if (isRerun) {
        const notebookControlData = await getNotebookControlData();
        await write('control/' + module, notebookControlData, {
          workspace,
        });
      }

      const topLevel = new Map();
      this.setState({ [`NotebookState/${module}`]: 'running' });
      await api.importModule(module, {
        clearUpdateEmits: true,
        topLevel,
        readCache: false,
        workspace,
      });
      // We can't emit infinity, so let's use an exceedingly large number.
      await resolvePending();
      this.setState({ [`NotebookState/${module}`]: 'idle' });

      removeOnEmitHandler(onEmitHandler);
      /*
      clearNotebookState(this, {
        path: module,
        workspace,
        isToBeKept: (note) => note.version === version,
      });
      */
    };

    const onKeyDown = (e) => {
      const CONTROL = 17;
      // const E = 69;
      const ENTER = 13;
      // const S = 83;
      const SHIFT = 16;

      const key = e.which || e.keyCode || 0;

      switch (key) {
        case CONTROL:
        case SHIFT:
          return true;
      }

      // const { ctrlKey, shiftKey } = e;
      const { shiftKey } = e;
      switch (key) {
        case ENTER: {
          if (shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            run({ isRerun: true });
            return false;
          }
          break;
        }
      }
    };

    setupWorkspace(workspace);
    // Construct a local ephemeral filesystem.
    for (const path of Object.keys(files)) {
      await write(path, files[path], { ephemeral: true });
    }

    await run();
    window.addEventListener('keydown', onKeyDown);
  }

  render() {
    const { module, workspace } = this.props;
    const {
      [`NotebookNotes/${module}`]: NotebookNotes = {},
      [`NotebookState/${module}`]: NotebookState = 'idle',
      [`NotebookDynamicViewPath/${module}`]: NotebookDynamicViewPath,
      [`NotebookDynamicViewView/${module}`]: NotebookDynamicViewView = {},
    } = this.state;

    const onClickView = async ({ note }) => {
      const { [`NotebookDynamicViewView/${module}`]: NotebookDynamicViewView } =
        this.state;
      this.setState({
        [`NotebookDynamicViewPath/${module}`]: note.path,
        [`NotebookDynamicViewView/${module}`]:
          NotebookDynamicViewView || note.view,
      });
    };

    return (
      <SplitPane>
        {NotebookDynamicViewPath && (
          <DynamicView
            path={NotebookDynamicViewPath}
            view={NotebookDynamicViewView}
            workspace={workspace}
          />
        )}
        <Notebook
          notebookPath={module}
          notes={NotebookNotes}
          workspace={workspace}
          onClickView={onClickView}
          state={NotebookState}
        />
      </SplitPane>
    );
  }
}

export const run = async ({
  baseUrl = '',
  encodedFiles,
  module,
  workspace,
  container,
}) => {
  const start = async () => {
    const files = decodeFiles(encodedFiles);
    await boot();
    ReactDOM.render(
      <Standalone
        baseUrl={baseUrl}
        workspace={workspace}
        module={module}
        files={files}
      />,
      container
    );
  };
  if (document.readyState === 'complete') {
    start();
  } else {
    document.onreadystatechange = () => {
      if (document.readyState === 'complete') {
        start();
      }
    };
  }
};
