import { acquire, release } from './evaluateLock.js';
import { evaluate as baseEvaluate, execute } from './evaluate.js';
import { isNode, read, restoreEmitGroup, saveEmitGroup } from '@jsxcad/sys';

const DYNAMIC_MODULES = new Map();

export const registerDynamicModule = (bare, path, nodePath) => {
  DYNAMIC_MODULES.set(bare, isNode ? nodePath : path);
};

const CACHED_MODULES = new Map();

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
    } = {}
  ) => {
    let emitGroup;
    try {
      if (doRelease) {
        emitGroup = saveEmitGroup();
        await release();
      }
      if (CACHED_MODULES.has(name)) {
        // It's ok for a module to evaluate to undefined so we need to check has explicitly.
        return CACHED_MODULES.get(name);
      }
      const internalModule = DYNAMIC_MODULES.get(name);
      if (internalModule !== undefined) {
        console.log(`QQ/internalModule: ${name} ${internalModule}`);
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
      const api = { ...baseApi, sha: 'master' };
      if (!evaluate) {
        evaluate = (script) => baseEvaluate(script, { api, path });
      }
      if (!replay) {
        replay = (script) => baseEvaluate(script, { api, path });
      }
      const builtModule = await execute(scriptText, {
        evaluate,
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
    } finally {
      if (doRelease) {
        await acquire();
        restoreEmitGroup(emitGroup);
      }
    }
  };
