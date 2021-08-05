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
    console.log(`QQ/importModule/0`);
    const internalModule = DYNAMIC_MODULES.get(name);
    if (internalModule !== undefined) {
      const module = await import(internalModule);
      CACHED_MODULES.set(name, module);
      return module;
    }
    console.log(`QQ/importModule/1`);
    let script;
    if (script === undefined) {
      const path = `source/${name}`;
      const sources = [];
      sources.push(name);
      script = await read(path, { sources });
    }
    console.log(`QQ/importModule/2`);
    if (script === undefined) {
      throw Error(`Cannot import module ${name}`);
    }
    console.log(`QQ/importModule/3`);
    const scriptText =
      typeof script === 'string'
        ? script
        : new TextDecoder('utf8').decode(script);
    console.log(`QQ/importModule/4`);
    const path = name;
    const topLevel = new Map();
    const api = { ...baseApi, sha: 'master' };
    console.log(`QQ/importModule/5`);
    const evaluate = (script) => baseEvaluate(script, { api, path });
    const replay = (script) => baseEvaluate(script, { api, path });
    console.log(`QQ/importModule/6`);

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
