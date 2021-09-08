import './jsxcad-api-v1-gcode.js';
import './jsxcad-api-v1-pdf.js';
import './jsxcad-api-v1-tools.js';
import * as mathApi from './jsxcad-api-v1-math.js';
import { addOnEmitHandler, addPending, write, read, emit, hash, getSourceLocation, getControlValue, popSourceLocation, pushSourceLocation } from './jsxcad-sys.js';
import * as shapeApi from './jsxcad-api-shape.js';
import { toEcmascript } from './jsxcad-compiler.js';
import { readStl, stl } from './jsxcad-api-v1-stl.js';
import { readObj } from './jsxcad-api-v1-obj.js';
import { readOff } from './jsxcad-api-v1-off.js';
import { readSvg } from './jsxcad-api-v1-svg.js';
import { toSvg } from './jsxcad-convert-svg.js';

let notes;

let recording = false;
let handler;

const recordNote = (note) => {
  if (recording) {
    notes.push(note);
  }
};

const beginRecordingNotes = (path, id, sourceLocation) => {
  notes = [];
  if (handler === undefined) {
    handler = addOnEmitHandler(recordNote);
  }
  recording = true;
};

const saveRecordedNotes = (path, id) => {
  let notesToSave = notes;
  notes = undefined;
  recording = false;
  addPending(write(`data/note/${path}/${id}`, notesToSave));
};

const replayRecordedNotes = async (path, id) => {
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

const emitSourceLocation = ({ path, id }) => {
  const setContext = { sourceLocation: { path, id } };
  emit({ hash: hash(setContext), setContext });
};

var notesApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  beginRecordingNotes: beginRecordingNotes,
  saveRecordedNotes: saveRecordedNotes,
  replayRecordedNotes: replayRecordedNotes,
  emitSourceLocation: emitSourceLocation
});

const evaluate = async (ecmascript, { api, path }) => {
  try {
    console.log(`QQ/evaluate: ${ecmascript.replace(/\n/g, '\n|   ')}`);
    const builder = new Function(
      `{ ${Object.keys(api).join(', ')} }`,
      `return async () => { ${ecmascript} };`
    );
    const op = await builder(api);
    const result = await op();
    return result;
  } catch (error) {
    throw error;
  }
};

const execute = async (
  script,
  {
    evaluate,
    replay,
    path,
    topLevel = new Map(),
    parallelUpdateLimit = Infinity,
    clearUpdateEmits = false,
  }
) => {
  try {
    let replaysDone = false;
    console.log(`QQ/Evaluate`);
    const scheduled = new Set();
    for (;;) {
      console.log(`QQ/Compile`);
      const updates = {};
      const replays = [];
      const exports = [];
      await toEcmascript(script, {
        path,
        topLevel,
        updates,
        replays,
        exports,
      });
      // Replay anything we can.
      if (!replaysDone) {
        console.log(`QQ/Replay`);
        replaysDone = true;
        for (const entry of replays) {
          await replay(entry, { path });
        }
      }
      // Update what we can.
      console.log(`QQ/Update`);
      const blockedUpdates = [];
      const updatePromises = [];
      // Determine the updates we can process.
      for (const id of Object.keys(updates)) {
        if (scheduled.has(id)) {
          continue;
        }
        const entry = updates[id];
        const outstandingDependencies = entry.dependencies.filter(
          (dependency) => updates[dependency] && dependency !== id
        );
        if (
          updatePromises.length === 0 &&
          outstandingDependencies.length === 0
        ) {
          // For now, only do one thing at a time, and block the remaining updates.
          const task = async () => {
            try {
              await evaluate(updates[id].program, { path });
              console.log(`Completed ${id}`);
            } catch (error) {
              throw error;
            }
          };
          updatePromises.push(task());
          scheduled.add(id);
        } else {
          blockedUpdates.push(id);
        }
      }
      // FIX: We could instead use Promise.race() and then see what new updates could be queued.
      while (updatePromises.length > 0) {
        await updatePromises.pop();
      }
      // Finally compute the exports.
      if (blockedUpdates.length === 0) {
        console.log(`QQ/Exports`);
        for (const entry of exports) {
          return await evaluate(entry, { path });
        }
        return;
      }
      // Otherwise recompute the updates and repeat.
    }
  } catch (error) {
    throw error;
  }
};

const DYNAMIC_MODULES = new Map();

const registerDynamicModule = (bare, path) =>
  DYNAMIC_MODULES.set(bare, path);

const CACHED_MODULES = new Map();

const buildImportModule =
  (baseApi) =>
  async (name, { clearUpdateEmits = false } = {}) => {
    try {
      const cachedModule = CACHED_MODULES.get(name);
      if (cachedModule !== undefined) {
        return cachedModule;
      }
      const internalModule = DYNAMIC_MODULES.get(name);
      if (internalModule !== undefined) {
        const module = await import(internalModule);
        CACHED_MODULES.set(name, module);
        return module;
      }
      let script;
      if (script === undefined) {
        const path = `source/${name}`;
        const sources = [];
        sources.push(name);
        script = await read(path, { sources });
      }
      if (script === undefined) {
        throw Error(`Cannot import module ${name}`);
      }
      const scriptText =
        typeof script === 'string'
          ? script
          : new TextDecoder('utf8').decode(script);
      const path = name;
      const topLevel = new Map();
      const api = { ...baseApi, sha: 'master' };
      const evaluate$1 = (script) => evaluate(script, { api, path });
      const replay = (script) => evaluate(script, { api, path });

      const builtModule = await execute(scriptText, {
        evaluate: evaluate$1,
        replay,
        path,
        topLevel,
        parallelUpdateLimit: 1,
        clearUpdateEmits,
      });
      CACHED_MODULES.set(name, builtModule);
      return builtModule;
    } catch (error) {
      throw error;
    }
  };

/*
  Options
  slider: { min, max, step }
  select: { options }
*/

const control = (label, value, type, options) => {
  const { path } = getSourceLocation();
  const control = {
    type,
    label,
    value: getControlValue(path, label, value),
    options,
    path,
  };
  emit({ control, hash: hash(control) });
  return value;
};

const api = {
  ...mathApi,
  ...shapeApi,
  ...notesApi,
  control,
  popSourceLocation,
  pushSourceLocation,
  readSvg,
  readStl,
  readObj,
  readOff,
  stl,
  toSvg,
};

const importModule = buildImportModule(api);

api.importModule = importModule;

// Register Dynamic libraries.

const module = (name) => `@jsxcad/api-v1-${name}`;

registerDynamicModule(module('armature'), './jsxcad-api-v1-armature.js');
registerDynamicModule(module('cursor'), './jsxcad-api-v1-cursor.js');
registerDynamicModule(module('deform'), './jsxcad-api-v1-deform.js');
registerDynamicModule(module('dst'), './jsxcad-api-v1-dst.js');
registerDynamicModule(module('dxf'), './jsxcad-api-v1-dxf.js');
registerDynamicModule(module('font'), './jsxcad-api-v1-font.js');
registerDynamicModule(module('gcode'), './jsxcad-api-v1-gcode.js');
registerDynamicModule(module('ldraw'), './jsxcad-api-v1-ldraw.js');
registerDynamicModule(module('math'), './jsxcad-api-v1-math.js');
registerDynamicModule(module('pdf'), './jsxcad-api-v1-pdf.js');
registerDynamicModule(module('png'), './jsxcad-api-v1-png.js');
registerDynamicModule(module('shape'), './jsxcad-api-v1-shape.js');
registerDynamicModule(module('shapefile'), './jsxcad-api-v1-shapefile.js');
registerDynamicModule(module('stl'), './jsxcad-api-v1-stl.js');
registerDynamicModule(module('svg'), './jsxcad-api-v1-svg.js');
registerDynamicModule(module('threejs'), './jsxcad-api-v1-threejs.js');
registerDynamicModule(module('units'), './jsxcad-api-v1-units.js');

export { api as default, evaluate, execute };
