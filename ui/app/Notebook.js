/* global mermaid */

import './Notebook.css';

import * as PropTypes from 'prop-types';

import { read, readOrWatch, write } from '@jsxcad/sys';

import ControlNote from './ControlNote.js';
import DownloadNote from './DownloadNote.js';
import EditNote from './EditNote.js';
import ErrorNote from './ErrorNote.js';
import MdNote from './MdNote.js';
import React from 'react';
import { SpinnerCircularSplit } from 'spinners-react';
import ViewNote from './ViewNote.js';
import { useEffect } from 'preact/hooks';

export const blurNotebookState = async (application, { path, workspace }) => {
  application.setState((state) => {
    const { [`NotebookNotes/${path}`]: oldNotebookNotes = {} } = state;
    const newNotebookNotes = {};
    for (const key of Object.keys(oldNotebookNotes)) {
      const note = oldNotebookNotes[key];
      newNotebookNotes[key] = { ...note, blur: true };
    }
    return { [`NotebookNotes/${path}`]: newNotebookNotes };
  });
};

export const clearNotebookState = async (
  application,
  { path, workspace, isToBeKept }
) => {
  application.setState((state) => {
    const { [`NotebookNotes/${path}`]: oldNotebookNotes = {} } = state;
    const newNotebookNotes = {};
    for (const key of Object.keys(oldNotebookNotes)) {
      const note = oldNotebookNotes[key];
      if (isToBeKept(note)) {
        newNotebookNotes[key] = note;
      }
    }
    return { [`NotebookNotes/${path}`]: newNotebookNotes };
  });
};

export const updateNotebookState = async (
  application,
  { notes, sourceLocation, workspace }
) => {
  const updateNote = (note) => {
    const { sourceLocation } = note;
    if (!sourceLocation) {
      return;
    }
    const { path } = sourceLocation;
    if (!note.hash) {
      return;
    }
    const op = (state) => {
      const { [`NotebookNotes/${path}`]: oldNotebookNotes = {} } = state;
      const oldNote = oldNotebookNotes[note.hash] || {};
      const newNotebookNotes = {
        ...oldNotebookNotes,
        [note.hash]: { ...oldNote, blur: false, ...note },
      };
      return { [`NotebookNotes/${path}`]: newNotebookNotes };
    };
    application.setState(op);
  };

  for (const note of notes) {
    updateNote(note);
    if (note.view) {
      if (!note.url) {
        const loadThumbnail = async () => {
          let url = await (note.needsThumbnail ? read : readOrWatch)(
            note.view.thumbnailPath,
            {
              workspace,
            }
          );
          if (!url) {
            const { path, view, sourceLocation } = note;
            const { width, height } = view;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const offscreenCanvas = canvas.transferControlToOffscreen();
            for (let nth = 0; nth < 3; nth++) {
              try {
                url = await application.ask(
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
                updateNote({ hash: note.hash, url, sourceLocation });
              } catch (error) {
                if (error.message === 'Terminated') {
                  // Try again.
                  continue;
                }
              }
            }
          }
          if (url) {
            updateNote({ hash: note.hash, url, sourceLocation });
          }
        };
        // Introduce a delay before rendering thumbnails to allow execution to proceed in the unthreaded cases.
        setTimeout(loadThumbnail, 200);
      }
    }
  }
};

export class Notebook extends React.PureComponent {
  static get propTypes() {
    return {
      notes: PropTypes.object,
      onChange: PropTypes.func,
      onClickView: PropTypes.func,
      onKeyDown: PropTypes.func,
      selectedLine: PropTypes.number,
      notebookPath: PropTypes.string,
      state: PropTypes.string,
      workspace: PropTypes.string,
    };
  }

  render() {
    const {
      notebookPath,
      notes,
      onChange,
      onClickView,
      onKeyDown,
      // selectedLine,
      state = 'idle',
      workspace,
    } = this.props;
    const ordered = Object.values(notes);
    const getLine = (note) => {
      if (note.sourceLocation) {
        return note.sourceLocation.line;
      } else {
        return 0;
      }
    };
    const getNth = (note) => {
      if (note.sourceLocation) {
        return note.sourceLocation.nth;
      } else {
        return 0;
      }
    };
    const order = (a, b) => {
      const lineA = getLine(a);
      const lineB = getLine(b);
      if (lineA !== lineB) {
        return lineA - lineB;
      }
      const nthA = getNth(a);
      const nthB = getNth(b);
      return nthA - nthB;
    };
    ordered.sort(order);
    let line = 0;
    let id;
    let hasStub = false;
    const ids = [];
    let children;
    for (const note of ordered) {
      if (note.sourceLocation.id !== id) {
        id = note.sourceLocation.id;
        children = [];
        ids.push({ id, children });
      }
      if (note.hash === 'stub') {
        hasStub = true;
      }
      // FIX: This seems wasteful.
      const selected = false;
      let child;
      if (note.sourceLocation) {
        line = note.sourceLocation.line;
      }
      if (note.view) {
        child = (
          <ViewNote
            key={note.hash}
            note={note}
            onClickView={onClickView}
            selected={selected}
          />
        );
      } else if (note.error) {
        child = (
          <ErrorNote
            key={note.hash}
            note={note}
            selected={selected}
            workspace={workspace}
          />
        );
      } else if (note.md) {
        child = (
          <MdNote
            key={note.hash}
            note={note}
            selected={selected}
            workspace={workspace}
          />
        );
      } else if (note.download) {
        child = (
          <DownloadNote
            key={note.hash}
            note={note}
            selected={selected}
            workspace={workspace}
          />
        );
      } else if (note.control) {
        child = (
          <ControlNote
            key={note.hash}
            note={note}
            selected={selected}
            workspace={workspace}
          />
        );
      } else if (note.sourceText !== undefined) {
        child = (
          <EditNote
            key={note.hash}
            note={note}
            onChange={(sourceText) => onChange(note, { sourceText })}
            onKeyDown={onKeyDown}
            selected={selected}
            workspace={workspace}
          />
        );
      }
      if (child) {
        children.push(child);
      }
    }

    if (!hasStub) {
      // Append an empty editor.
      const stub = {
        hash: 'stub',
        sourceText: '',
        sourceLocation: { path: notebookPath, line: line + 1 },
      };
      ids.push({
        id: '+',
        children: [
          <EditNote
            key={stub.hash}
            note={stub}
            onChange={(sourceText) => onChange(stub, { sourceText })}
            workspace={workspace}
          />,
        ],
      });
    }

    useEffect(() => mermaid.init(undefined, '.mermaid'));

    const sections = [];
    for (const { id, children } of ids) {
      sections.push(
        <div>
          <h3>{id}</h3>
          <br />
          {children}
          <hr />
        </div>
      );
    }

    return (
      <div
        id={notebookPath}
        classList="notebook notes"
        style={{ overflow: 'auto' }}
      >
        {state === 'running' && (
          <SpinnerCircularSplit
            color="#36d7b7"
            size={64}
            style={{ position: 'fixed', right: 32, top: 64, zIndex: 1000 }}
          />
        )}
        {sections}
      </div>
    );
  }
}

export default Notebook;
