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

const recordNote = (note, index) => {
  if (recording) {
    notes.push({ note, index });
  }
};

export const beginRecordingNotes = (path, id, sourceLocation) => {
  const setContext = { recording: { path, id } };
  emit({ hash: hash(setContext), setContext });

  if (handler === undefined) {
    handler = addOnEmitHandler(recordNote);
  }
  recording = true;
  notes = [];
};

export const saveRecordedNotes = (path, id) => {
  let notesToSave = notes;
  notes = undefined;
  recording = false;
  addPending(write(`data/note/${path}/${id}`, notesToSave));
};

export const replayRecordedNotes = async (path, id) => {
  const setContext = { recording: { path, id } };
  emit({ hash: hash(setContext), setContext });

  const notes = await read(`data/note/${path}/${id}`);

  if (notes === undefined) {
    return;
  }
  if (notes.length === 0) {
    return;
  }
  for (const { note } of notes) {
    emit(note);
  }
};
