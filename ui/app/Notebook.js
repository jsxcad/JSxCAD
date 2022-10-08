/* global mermaid */

import './Notebook.css';

import * as PropTypes from 'prop-types';

import { logInfo, read, write } from '@jsxcad/sys';

import ControlNote from './ControlNote.js';
import DownloadNote from './DownloadNote.js';
import MdNote from './MdNote.js';
import { MoonLoader } from 'react-spinners';
import React from 'react';
import ViewNote from './ViewNote.js';
import { useEffect } from 'preact/hooks';

export const updateNotebookState = async (
  application,
  { notes, sourceLocation, workspace }
) => {
  const { id, path } = sourceLocation;
  const updateNote = (note) => {
    if (note.beginSourceLocation) {
      // Remove any existing notes for this line.
      const { line } = note.beginSourceLocation;
      const op = (state) => {
        const { [`NotebookNotes/${path}`]: oldNotebookNotes = {} } = state;
        const newNotebookNotes = {
          ...oldNotebookNotes,
        };
        for (const key of Object.keys(newNotebookNotes)) {
          const note = newNotebookNotes[key];
          if (note.sourceLocation && note.sourceLocation.line === line) {
            delete newNotebookNotes[key];
          }
        }
        return { [`NotebookNotes/${path}`]: newNotebookNotes };
      };
      application.setState(op);
    }
    if (!note.hash) {
      return;
    }
    const op = (state) => {
      const { [`NotebookNotes/${path}`]: oldNotebookNotes = {} } = state;
      const oldNote = oldNotebookNotes[note.hash] || {};
      const newNotebookNotes = {
        ...oldNotebookNotes,
        [note.hash]: { ...oldNote, ...note },
      };
      return { [`NotebookNotes/${path}`]: newNotebookNotes };
    };
    application.setState(op);
  };

  for (const note of notes) {
    updateNote(note);
    if (note.view) {
      if (!note.url) {
        const cachedUrl = await read(`thumbnail/${note.hash}`, {
          workspace,
        });
        if (cachedUrl) {
          updateNote({ hash: note.hash, url: cachedUrl });
          continue;
        }
        if (note.path && !note.data) {
          note.data = await read(note.path, { workspace });
        }
        const { path, view } = note;
        const { width, height } = view;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const offscreenCanvas = canvas.transferControlToOffscreen();
        const render = async () => {
          try {
            logInfo('app/App', `Ask render for ${path}/${id}`);
            const url = await application.ask(
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
            await write(`thumbnail/${note.hash}`, url, {
              workspace,
            });
            updateNote({ hash: note.hash, url });
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
};

export class Notebook extends React.PureComponent {
  static get propTypes() {
    return {
      notes: PropTypes.array,
      onClickView: PropTypes.func,
      selectedLine: PropTypes.number,
      workspace: PropTypes.string,
    };
  }

  render() {
    try {
      const { notes, onClickView, selectedLine, workspace } = this.props;
      const children = [];
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
      let line;
      let selectedNote;
      for (const note of ordered) {
        if (!note.view && !note.md && !note.download && !note.control) {
          continue;
        }
        // FIX: This seems wasteful.
        if (note.sourceLocation && note.sourceLocation.line !== line) {
          line = note.sourceLocation.line;
          if (note.sourceLocation.line <= selectedLine) {
            selectedNote = note;
          }
        }
      }
      for (const note of ordered) {
        // FIX: This seems wasteful.
        const selected = note === selectedNote;
        let child;
        if (note.view) {
          child = (
            <ViewNote
              key={note.hash}
              note={note}
              onClickView={onClickView}
              selected={selected}
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
        }
        if (child) {
          children.push(child);
        }
      }
      console.log(`render Notebook`);
      if (children.length === 0) {
        return <MoonLoader color="#36d7b7" size="128px" />;
      }

      useEffect(() => mermaid.init(undefined, '.mermaid'));

      return (
        <div classList="notes" style={{ overflow: 'auto' }}>
          {children}
        </div>
      );
    } catch (e) {
      console.log(e.stack);
      throw e;
    }
  }
}

export default Notebook;
