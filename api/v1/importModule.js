import { getSources, readFile } from '@jsxcad/sys';

import { toEcmascript } from '@jsxcad/compiler';

const DYNAMIC_MODULES = new Map();

export const registerDynamicModule = (bare, path) => DYNAMIC_MODULES.set(bare, path);

export const buildImportModule = (api) =>
  async (name) => {
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
      script = await readFile({ path, as: 'utf8', sources }, path);
    }
    const ecmascript = toEcmascript({}, script);
    const builder = new Function(`{ ${Object.keys(api).join(', ')} }`, ecmascript);
    const constructor = await builder(api);
    const module = await constructor();
    return module;
  };
