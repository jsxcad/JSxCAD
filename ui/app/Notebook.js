/* global mermaid */

import './Notebook.css';

import * as PropTypes from 'prop-types';

import { read, readOrWatch, write } from '@jsxcad/sys';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ControlNote from './ControlNote.js';
import DownloadNote from './DownloadNote.js';
import EditNote from './EditNote.js';
import ErrorNote from './ErrorNote.js';
import MdNote from './MdNote.js';
import React from 'react';
import Row from 'react-bootstrap/Row';
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
                console.log(`QQ/ask staticView nth=${nth}`);
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
            note.url = url;
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
    try {
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
      const entries = new Map();
      for (const note of ordered) {
        const id = note.sourceLocation.id;
        if (!entries.has(id)) {
          entries.set(id, {
            blur: false,
            downloads: [],
            errors: [],
            views: [],
            mds: [],
            controls: [],
            editors: [],
          });
        }
        const entry = entries.get(id);
        // FIX: This seems wasteful.
        const selected = false;
        if (note.view) {
          entry.views.push(
            <ViewNote
              key={note.hash}
              note={note}
              onClickView={onClickView}
              selected={selected}
            />
          );
        } else if (note.error) {
          entry.errors.push(
            <Card.Body variant="danger">
              <Card.Text>
                <ErrorNote
                  key={note.hash}
                  note={note}
                  selected={selected}
                  workspace={workspace}
                />
              </Card.Text>
            </Card.Body>
          );
        } else if (note.md) {
          entry.mds.push(
            <MdNote
              key={note.hash}
              note={note}
              selected={selected}
              workspace={workspace}
            />
          );
        } else if (note.download) {
          entry.downloads.push(
            <DownloadNote
              key={note.hash}
              note={note}
              selected={selected}
              workspace={workspace}
            />
          );
        } else if (note.control) {
          entry.controls.push(
            <ControlNote
              key={note.hash}
              note={note}
              selected={selected}
              workspace={workspace}
            />
          );
        } else if (note.sourceText !== undefined) {
          entry.editors.push(
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
      }

      useEffect(() => mermaid.init(undefined, '.mermaid'));

      const sections = [];
      const compare = (a, b) => {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        } else {
          return 0;
        }
      };
      const ids = [...entries.keys()];
      ids.sort((a, b) => compare(a.id, b.id));
      for (const id of ids) {
        const {
          downloads = [],
          errors = [],
          views = [],
          mds = [],
          controls = [],
          editors = [],
        } = entries.get(id);
        sections.push(
          <Card key={id}>
            <Card.Header id={`note-id-${id}`}>{id}</Card.Header>
            {errors}
            <Container>
              <Row>
                {views.map((view, nth) => (
                  <Col key={nth}>{view}</Col>
                ))}
                {controls.length > 0 ? (
                  <Card>
                    <Card.Body>{controls}</Card.Body>
                  </Card>
                ) : (
                  []
                )}
                {downloads.length > 0 ? (
                  <Card>
                    <Card.Body>{downloads}</Card.Body>
                  </Card>
                ) : (
                  []
                )}
              </Row>
            </Container>
            <Card.Body>
              {mds}
              {editors}
            </Card.Body>
          </Card>
        );
      }

      return (
        <div
          id={notebookPath}
          classList="notebook notes"
          style={{ overflow: 'auto' }}
        >
          {false && state === 'running' && (
            <SpinnerCircularSplit
              color="#36d7b7"
              size={64}
              style={{ position: 'fixed', right: 32, top: 64, zIndex: 1000 }}
            />
          )}
          {sections}
        </div>
      );
    } catch (error) {
      console.log(error.stack);
      throw error;
    }
  }
}

export default Notebook;
