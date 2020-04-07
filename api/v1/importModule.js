import { getSources, readFile } from '@jsxcad/sys';

import { toEcmascript } from '@jsxcad/compiler';

const DYNAMIC_MODULES = new Map();

export const registerDynamicModule = (bare, path) => DYNAMIC_MODULES.set(bare, path);

export const buildImportModule = (api) =>
  async (name, { src } = {}) => {
    const internalModule = DYNAMIC_MODULES.get(name);
    if (internalModule !== undefined) {
      const module = await import(internalModule);
      return module;
    }
    let script;
    if (script === undefined) {
      const path = `source/${name}`;
      script = await readFile({ path, as: 'utf8' }, path);
    }
    if (script === undefined) {
      const path = `cache/${name}`;
      const sources = getSources(path);
      if (src) {
        sources.push(src);
      }
      script = await readFile({ path, as: 'utf8', sources }, path);
    }
    const ecmascript = await toEcmascript(script);
    const builder = new Function(`{ ${Object.keys(api).join(', ')} }`, `return async () => { ${ecmascript} };`);
    const module = await builder(api);
    exports = await module();
    return exports;
  };
