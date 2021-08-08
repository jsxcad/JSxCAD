import { evaluate as baseEvaluate, execute } from './evaluate.js';

import { read } from '@jsxcad/sys';

const DYNAMIC_MODULES = new Map();

export const registerDynamicModule = (bare, path) =>
  DYNAMIC_MODULES.set(bare, path);

const CACHED_MODULES = new Map();

export const buildImportModule = (baseApi) => async (name) => {
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
    const evaluate = (script) => baseEvaluate(script, { api, path });
    const replay = (script) => baseEvaluate(script, { api, path });

    const builtModule = await execute(scriptText, {
      evaluate,
      replay,
      path,
      topLevel,
      parallelUpdateLimit: 1,
    });
    CACHED_MODULES.set(name, builtModule);
    return builtModule;
  } catch (error) {
    throw error;
  }
};
