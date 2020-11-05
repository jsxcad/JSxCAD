import { addOnEmitHandler, emit, read, write } from '@jsxcad/sys';

const notes = [];

let replaying = false;
let handler;

const recordNote = (note, index) => {
  if (!replaying) {
    notes.push({ note, index });
  }
};

export const beginRecordingNotes = () => {
  if (handler === undefined) {
    handler = addOnEmitHandler(recordNote);
  }
  notes.length = 0;
};

export const saveRecordedNotes = async (path) => {
  await write(path, notes);
};

export const replayRecordedNotes = async (path) => {
  try {
    replaying = true;
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
  } finally {
    replaying = false;
  }
};
