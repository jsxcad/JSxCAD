import * as api from './main';

import { readFile } from '@jsxcad/sys';
import { toEcmascript } from '@jsxcad/compiler';

export const importModule = async (name, sources = []) => {
  const path = `module/${name}`;
  if (typeof sources === 'string') {
    sources = [sources];
  }
  const script = await readFile({ path, as: 'utf8', sources }, path);
  const ecmascript = toEcmascript({}, script);
  const builder = new Function(`{ ${Object.keys(api).join(', ')} }`, ecmascript);
  const constructor = await builder(api);
  const module = await constructor();
  return module;
};
