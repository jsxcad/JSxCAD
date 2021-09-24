import {
  addOnEmitHandler,
  addPending,
  beginEmitGroup,
  emit,
  finishEmitGroup,
  flushEmitGroup,
  hash,
  read,
  resolvePending,
  write,
} from '@jsxcad/sys';

import { loadGeometry, saveGeometry } from '@jsxcad/api-shape';

let recordedNotes;

let recording = false;
let handler;

const recordNotes = (notes) => {
  if (recording) {
    recordedNotes.push(...notes);
  }
};

export const beginRecordingNotes = (path, id) => {
  recordedNotes = [];
  if (handler === undefined) {
    handler = addOnEmitHandler(recordNotes);
  }
  recording = true;
};

export const clearRecordedNotes = () => {
  recordedNotes = undefined;
  recording = false;
};

export const saveRecordedNotes = (path, id) => {
  let notesToSave = recordedNotes;
  recordedNotes = undefined;
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
  flushEmitGroup();
};

export const emitSourceLocation = ({ path, id }) => {
  const setContext = { sourceLocation: { path, id } };
  emit({ hash: hash(setContext), setContext });
};

export const emitSourceText = (sourceText) =>
  emit({ hash: hash(sourceText), sourceText });

export const $run = async (op, { path, id, text, sha }) => {
  const meta = await read(`meta/def/${path}/${id}`);
  if (!meta || meta.sha !== sha) {
    beginRecordingNotes(path, id);
    beginEmitGroup({ path, id });
    emitSourceText(text);
    const result = await op();
    await resolvePending();
    finishEmitGroup({ path, id });
    if (typeof result === 'object') {
      const type = result.constructor.name;
      switch (type) {
        case 'Shape':
          await saveGeometry(`data/def/${path}/${id}`, result);
          await write(`meta/def/${path}/${id}`, { sha, type });
          await saveRecordedNotes(path, id);
          return result;
      }
    }
    clearRecordedNotes();
    return result;
  } else if (meta.type === 'Shape') {
    await replayRecordedNotes(path, id);
    return loadGeometry(`data/def/${path}/${id}`);
  } else {
    throw Error('Unexpected cached result');
  }
};
