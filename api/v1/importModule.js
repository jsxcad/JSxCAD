import * as api from './main';

import { getSources, readFile } from '@jsxcad/sys';

import { toEcmascript } from '@jsxcad/compiler';

export const importModule = async (name) => {
  const path = name;
  const sources = getSources(path);
  console.log(`QQ/importModule/path: ${path}`);
  console.log(`QQ/importModule/sources: ${JSON.stringify(sources)}`);
  const script = await readFile({ path, as: 'utf8', sources }, path);
  const ecmascript = toEcmascript({}, script);
  const builder = new Function(`{ ${Object.keys(api).join(', ')} }`, ecmascript);
  const constructor = await builder(api);
  const module = await constructor();
  return module;
};
