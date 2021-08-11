import {
  addOnEmitHandler,
  addPending,
  emit,
  hash,
  read,
  write,
} from '@jsxcad/sys';

let notes;

let recording = false;
let handler;

const recordNote = (note) => {
  if (recording) {
    notes.push(note);
  }
};

export const beginRecordingNotes = (path, id, sourceLocation) => {
  notes = [];
  if (handler === undefined) {
    handler = addOnEmitHandler(recordNote);
  }
  recording = true;
};

export const saveRecordedNotes = (path, id) => {
  let notesToSave = notes;
  notes = undefined;
  recording = false;
  addPending(write(`data/note/${path}/${id}`, notesToSave));
};

export const replayRecordedNotes = async (path, id) => {
  const notes = await read(`data/note/${path}/${id}`);

  if (notes === undefined) {
    return;
  }
  if (notes.length === 0) {
    return;
  }
  for (const note of notes) {
    emit(note);
  }
};

export const emitSourceLocation = ({ path, id }) => {
  const setContext = { sourceLocation: { path, id } };
  emit({ hash: hash(setContext), setContext });
};
