import * as PropTypes from 'prop-types';

import Notebook, { updateNotebookState } from './Notebook.js';

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

import React from 'react';
import ReactDOM from 'react-dom';
import api from '@jsxcad/api';
import { dataUrl } from '@jsxcad/ui-threejs';
import { getNotebookControlData } from '@jsxcad/ui-notebook';

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
      const addNotes = async (notes) => {
        if (notes.length === 0) {
          return;
        }
        const sourceLocation = notes[0].sourceLocation;
        // TODO: Parallelize these operations.
        await renderViews(notes);
        await fixLinks(notes);
        await prepareDownloads(notes);
        updateNotebookState(this, { notes, sourceLocation, workspace });
      };

      const onEmitHandler = addOnEmitHandler(addNotes);

      if (isRerun) {
        const notebookControlData = await getNotebookControlData();
        await write('control/' + module, notebookControlData, {
          workspace,
        });
      }

      const topLevel = new Map();
      await api.importModule(module, {
        clearUpdateEmits: true,
        topLevel,
        readCache: false,
        workspace,
      });

      await resolvePending();

      removeOnEmitHandler(onEmitHandler);
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
    await boot();

    // Construct a local ephemeral filesystem.
    for (const path of Object.keys(files)) {
      await write(path, files[path], { ephemeral: true });
    }

    await run();
    window.addEventListener('keydown', onKeyDown);
  }

  render() {
    const { module, workspace } = this.props;
    const { [`NotebookNotes/${module}`]: NotebookNotes = [] } = this.state;
    return <Notebook notes={NotebookNotes} workspace={workspace} />;
  }
}

export const run = async ({
  baseUrl = '',
  encodedFiles,
  module,
  workspace,
  container,
}) => {
  const start = () => {
    const files = decodeFiles(encodedFiles);
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
