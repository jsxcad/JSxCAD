import { acquire, release } from './evaluateLock.js';
import { evaluate as baseEvaluate, execute } from './evaluate.js';
import { isNode, read, restoreEmitGroup, saveEmitGroup } from '@jsxcad/sys';

const DYNAMIC_MODULES = new Map();

export const registerDynamicModule = (path, browserPath, nodePath) => {
  DYNAMIC_MODULES.set(path, isNode ? nodePath : browserPath);
};

const CACHED_MODULES = new Map();

let toSourceFromName = (name) => name;

export const setToSourceFromNameFunction = (op) => {
  toSourceFromName = op;
};

export const importScript = async (
  baseApi,
  name,
  scriptText,
  {
    clearUpdateEmits = false,
    topLevel = new Map(),
    evaluate,
    replay,
    updateCache = true,
    workspace,
  } = {}
) => {
  try {
    const path = name;
    const api = { ...baseApi, sha: 'master' };
    if (!evaluate) {
      evaluate = (script) => baseEvaluate(script, { api, path });
    }
    if (!replay) {
      replay = (script) => baseEvaluate(script, { api, path });
    }
    const builtModule = await execute(scriptText, {
      api,
      evaluate,
      replay,
      path,
      topLevel,
      parallelUpdateLimit: 1,
      clearUpdateEmits,
      workspace,
    });
    if (updateCache) {
      CACHED_MODULES.set(name, builtModule);
    }
    return builtModule;
  } catch (error) {
    throw error;
  }
};

export const buildImportModule =
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
