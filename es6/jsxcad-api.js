import './jsxcad-api-v1-gcode.js';
import './jsxcad-api-v1-pdf.js';
import './jsxcad-api-v1-tools.js';
import * as mathApi from './jsxcad-api-v1-math.js';
import * as shapeApi from './jsxcad-api-shape.js';
import { Group, Shape, save, load } from './jsxcad-api-shape.js';
import { addOnEmitHandler, write, read, emit, flushEmitGroup, computeHash, logInfo, startTime, beginEmitGroup, resolvePending, finishEmitGroup, endTime, saveEmitGroup, restoreEmitGroup, isWebWorker, isNode, getSourceLocation } from './jsxcad-sys.js';
import { toEcmascript } from './jsxcad-compiler.js';
import { readObj } from './jsxcad-api-v1-obj.js';
import { readOff } from './jsxcad-api-v1-off.js';
import { toSvg } from './jsxcad-convert-svg.js';

let recordedNotes;

let recording = false;
let handler;

const recordNotes = (notes) => {
  if (recording) {
    recordedNotes.push(...notes);
  }
};

const beginRecordingNotes = (path, id) => {
  recordedNotes = [];
  if (handler === undefined) {
    handler = addOnEmitHandler(recordNotes);
  }
  recording = true;
};

const clearRecordedNotes = () => {
  recordedNotes = undefined;
  recording = false;
};

const saveRecordedNotes = (path, id) => {
  let notesToSave = recordedNotes;
  recordedNotes = undefined;
  recording = false;
  return write(`data/note/${path}/${id}.note`, notesToSave);
};

const replayRecordedNotes = async (path, id) => {
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

const emitSourceText = (sourceText) =>
  emit({ hash: computeHash(sourceText), sourceText });

const $run = async (op, { path, id, text, sha, line }) => {
  const meta = await read(`meta/def/${path}/${id}.meta`);
  if (!meta || meta.sha !== sha) {
    logInfo('api/core/$run', text);
    const timer = startTime(`${path}/${id}`);
    beginRecordingNotes();
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

var notesApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  beginRecordingNotes: beginRecordingNotes,
  clearRecordedNotes: clearRecordedNotes,
  saveRecordedNotes: saveRecordedNotes,
  replayRecordedNotes: replayRecordedNotes,
  emitSourceText: emitSourceText,
  $run: $run
});

let locked = false;
const pending = [];

const acquire = async () => {
  if (locked) {
    return new Promise((resolve, reject) => pending.push(resolve));
  } else {
    locked = true;
  }
};

const release = async () => {
  if (pending.length > 0) {
    const resolve = pending.pop();
    resolve(true);
  } else {
    locked = false;
  }
};

let api$1;

const setApi = (value) => {
  api$1 = value;
};

const getApi = () => api$1;

const evaluate = async (ecmascript, { api, path }) => {
  const where = isWebWorker ? 'worker' : 'browser';
  let emitGroup;
  try {
    await acquire();
    emitGroup = saveEmitGroup();
    logInfo(
      'api/core/evaluate/script',
      `${where}: ${ecmascript.replace(/\n/g, '\n|   ')}`
    );
    const builder = new Function(
      `{ ${Object.keys(api).join(', ')} }`,
      `return async () => { ${ecmascript} };`
    );
    // Add import to make import.meta.url available.
    const op = await builder({ ...api, import: { meta: { url: path } } });
    // Retry until none of the operations block.
    for (;;) {
      const result = await op();
      return result;
    }
  } catch (error) {
    throw error;
  } finally {
    if (emitGroup) {
      restoreEmitGroup(emitGroup);
    }
    await release();
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
    workspace,
  }
) => {
  try {
    let replaysDone = false;
    let importsDone = false;
    const scheduled = new Set();
    const completed = new Set();
    for (;;) {
      const updates = {};
      const replays = {};
      const exports = [];
      await toEcmascript(script, {
        path,
        topLevel,
        updates,
        replays,
        exports,
        workspace,
      });
      // Make sure modules are prepared.
      if (!importsDone) {
        const { importModule } = getApi();
        // The imports we'll need to run these updates.
        const imports = new Set();
        for (const id of Object.keys(updates)) {
          const update = updates[id];
          if (update.imports) {
            for (const entry of update.imports) {
              imports.add(entry);
            }
          }
        }
        // We could run these in parallel, but let's keep it simple for now.
        for (const path of imports) {
          await importModule(path, {
            evaluate,
            replay,
            doRelease: false,
            workspace,
          });
        }
        // At this point the modules should build with a simple replay.
      }
      // Replay anything we can.
      if (!replaysDone) {
        replaysDone = true;
        for (const id of Object.keys(replays)) {
          await replay(replays[id].program, { path });
          completed.add(id);
        }
      }
      // Update what we can.
      const unprocessedUpdates = new Set(Object.keys(updates));
      while (unprocessedUpdates.size > 0) {
        const updatePromises = [];
        // Determine the updates we can process.
        for (const id of unprocessedUpdates) {
          if (scheduled.has(id)) {
            continue;
          }
          const entry = updates[id];
          const outstandingDependencies = entry.dependencies.filter(
            (dependency) =>
              !completed.has(dependency) &&
              updates[dependency] &&
              dependency !== id
          );
          if (
            updatePromises.length <= 1 &&
            outstandingDependencies.length === 0
          ) {
            // For now, only do one thing at a time, and block the remaining updates.
            const task = async () => {
              try {
                await evaluate(updates[id].program, { path });
                completed.add(id);
                console.log(`Completed ${id}`);
              } catch (error) {
                throw error;
              }
            };
            updatePromises.push(task());
            unprocessedUpdates.delete(id);
            scheduled.add(id);
          }
        }
        // FIX: We could instead use Promise.race() and then see what new updates could be queued.
        while (updatePromises.length > 0) {
          await updatePromises.pop();
        }
      }
      // Finally compute the exports.
      for (const entry of exports) {
        return await evaluate(entry, { path });
      }
      return;
    }
  } catch (error) {
    throw error;
  }
};

const DYNAMIC_MODULES = new Map();

const registerDynamicModule = (path, browserPath, nodePath) => {
  DYNAMIC_MODULES.set(path, isNode ? nodePath : browserPath);
};

const CACHED_MODULES = new Map();

let toSourceFromName = (name) => name;

const setToSourceFromNameFunction = (op) => {
  toSourceFromName = op;
};

const importScript = async (
  baseApi,
  name,
  scriptText,
  {
    clearUpdateEmits = false,
    topLevel = new Map(),
    evaluate: evaluate$1,
    replay,
    doRelease = true,
    readCache = true,
    workspace,
  } = {}
) => {
  try {
    const path = name;
    const api = { ...baseApi, sha: 'master' };
    if (!evaluate$1) {
      evaluate$1 = (script) => evaluate(script, { api, path });
    }
    if (!replay) {
      replay = (script) => evaluate(script, { api, path });
    }
    const builtModule = await execute(scriptText, {
      evaluate: evaluate$1,
      replay,
      path,
      topLevel,
      parallelUpdateLimit: 1,
      clearUpdateEmits,
      workspace,
    });
    CACHED_MODULES.set(name, builtModule);
    return builtModule;
  } catch (error) {
    throw error;
  }
};

const buildImportModule =
  (baseApi) =>
  async (
    name,
    {
      clearUpdateEmits = false,
      topLevel = new Map(),
      evaluate,
      replay,
      doRelease = true,
      readCache = true,
      workspace,
    } = {}
  ) => {
    let emitGroup;
    try {
      if (doRelease) {
        emitGroup = saveEmitGroup();
        await release();
      }
      const qualifiedName = `${workspace}/${name}`;
      if (readCache && CACHED_MODULES.has(qualifiedName)) {
        // It's ok for a module to evaluate to undefined so we need to check has explicitly.
        return CACHED_MODULES.get(qualifiedName);
      }
      const internalModule = DYNAMIC_MODULES.get(name);
      if (internalModule !== undefined) {
        const module = await import(internalModule);
        CACHED_MODULES.set(qualifiedName, module);
        return module;
      }
      let script;
      if (script === undefined) {
        const path = `source/${name}`;
        const sources = [];
        sources.push(toSourceFromName(name));
        script = await read(path, { sources, workspace });
      }
      if (script === undefined) {
        throw Error(`Cannot import module ${name}`);
      }
      const scriptText =
        typeof script === 'string'
          ? script
          : new TextDecoder('utf8').decode(script);
      const path = name;
      const builtModule = await importScript(baseApi, name, scriptText, {
        evaluate,
        replay,
        path,
        topLevel,
        parallelUpdateLimit: 1,
        clearUpdateEmits,
        workspace,
      });
      CACHED_MODULES.set(qualifiedName, builtModule);
      return builtModule;
    } catch (error) {
      throw error;
    } finally {
      if (doRelease) {
        await acquire();
        restoreEmitGroup(emitGroup);
      }
    }
  };

/*
  Options
  slider: { min, max, step }
  select: { options }
*/

const control = (label, defaultValue, type, options) => {
  const { path } = getSourceLocation();
  // const value = getControlValue(path, label, defaultValue);
  const value = defaultValue;
  const control = {
    type,
    label,
    value,
    options,
    path,
  };
  // console.log(`QQ/control: label=${label} get=${value} def=${defaultValue}`);
  emit({ control, hash: computeHash(control) });
  return value;
};

const api = {
  _: undefined,
  ...mathApi,
  ...shapeApi,
  ...notesApi,
  control,
  readObj,
  readOff,
  setToSourceFromNameFunction,
  toSvg,
};

const importModule = buildImportModule(api);

api.importModule = importModule;

// Register Dynamically loadable modules.

registerDynamicModule(
  '@' + 'jsxcad/api-threejs',
  './jsxcad-api-threejs.js',
  '../threejs/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-dst',
  './jsxcad-api-v1-dst.js',
  '../v1-dst/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-dxf',
  './jsxcad-api-v1-dxf.js',
  '../v1-dxf.main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-font',
  './jsxcad-api-v1-font.js',
  '../v1-font/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-gcode',
  './jsxcad-api-v1-gcode.js',
  '../v1-gcode/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-ldraw',
  './jsxcad-api-v1-ldraw.js',
  '../v1-ldraw/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-math',
  './jsxcad-api-v1-math.js',
  '../v1-math/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-pdf',
  './jsxcad-api-v1-pdf.js',
  '../v1-pdf/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-threejs',
  './jsxcad-api-v1-threejs.js',
  '../v1-threejs/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-shape',
  './jsxcad-api-v1-shape.js',
  '../v1-shape/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-shapefile',
  './jsxcad-api-v1-shapefile.js',
  '../v1-shapefile/main.js'
);

setApi(api);

export { api as default, evaluate, execute, importScript };
