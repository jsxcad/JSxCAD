import { read } from '@jsxcad/sys';

import { toEcmascript } from '@jsxcad/compiler';

const DYNAMIC_MODULES = new Map();

export const registerDynamicModule = (bare, path) =>
  DYNAMIC_MODULES.set(bare, path);

export const buildImportModule = (api) => async (name, { src } = {}) => {
  const internalModule = DYNAMIC_MODULES.get(name);
  if (internalModule !== undefined) {
    const module = await import(internalModule);
    return module;
  }
  let script;
  if (script === undefined) {
    const path = `source/${name}`;
    const sources = [];
    if (src) {
      sources.push(src);
    }
    sources.push(name);
    script = await read(path, { sources, decode: 'utf8' });
  }
  if (script === undefined) {
    throw Error(`Cannot import module ${name}`);
  }
  const ecmascript = await toEcmascript(script);
  const builder = new Function(
    `{ ${Object.keys(api).join(', ')} }`,
    `return async () => { ${ecmascript} };`
  );
  const module = await builder(api);
  const exports = await module();
  return exports;
};
