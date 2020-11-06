import { addOnEmitHandler, addPending, emit, read, write } from '@jsxcad/sys';

let notes;

let recording = false;
let handler;

const recordNote = (note, index) => {
  if (recording) {
    notes.push({ note, index });
  }
};

export const beginRecordingNotes = () => {
  if (handler === undefined) {
    handler = addOnEmitHandler(recordNote);
  }
  recording = true;
  notes = [];
};

export const saveRecordedNotes = (path) => {
  let notesToSave = notes;
  notes = undefined;
  recording = false;
  addPending(write(path, notesToSave));
};

export const replayRecordedNotes = async (path) => {
  const notes = await read(path);
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
