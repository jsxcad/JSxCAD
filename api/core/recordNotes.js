import { Group, Shape, load, save } from '@jsxcad/api-shape';
import {
  addOnEmitHandler,
  beginEmitGroup,
  computeHash,
  emit,
  endTime,
  finishEmitGroup,
  flushEmitGroup,
  logInfo,
  read,
  resolvePending,
  startTime,
  write,
} from '@jsxcad/sys';

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
  return write(`data/note/${path}/${id}.note`, notesToSave);
};

export const replayRecordedNotes = async (path, id) => {
  const notes = await read(`data/note/${path}/${id}.note`);

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

export const emitSourceText = (sourceText) =>
  emit({ hash: computeHash(sourceText), sourceText });

export const $run = async (op, { path, id, text, sha, line }) => {
  const meta = await read(`meta/def/${path}/${id}.meta`);
  if (!meta || meta.sha !== sha) {
    logInfo('api/core/$run', text);
    const timer = startTime(`${path}/${id}`);
    beginRecordingNotes(path, id);
    beginEmitGroup({ path, id, line });
    emitSourceText(text);
    let result;
    try {
      result = await op();
    } catch (error) {
      if (error.debugGeometry) {
        Group(
          ...error.debugGeometry.map((geometry) => Shape.fromGeometry(geometry))
        )
          .md(error.message)
          .md('Debug Geometry: ')
          .view();
        await resolvePending();
        finishEmitGroup({ path, id, line });
      }
      throw error;
    }
    await resolvePending();
    endTime(timer);
    finishEmitGroup({ path, id });
    try {
      if (result !== undefined) {
        // These may introduce a race -- let's see if we can make it transactional.
        await saveRecordedNotes(path, id);
        await save(`data/def/${path}/${id}.data`, result);
        await write(`meta/def/${path}/${id}.meta`, { sha });
        return result;
      }
    } catch (error) {}
    clearRecordedNotes();
    return result;
  } else {
    await replayRecordedNotes(path, id);
    const result = await load(`data/def/${path}/${id}.data`);
    return Shape.chain(result);
  }
};
