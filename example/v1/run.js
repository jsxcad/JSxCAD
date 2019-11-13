import { addSource, setupFilesystem } from '@jsxcad/sys';
import { promises, readFileSync } from 'fs';

import argv from 'argv';
import { importModule } from '@jsxcad/api-v1';
import { toEcmascript } from '@jsxcad/compiler';

export const run = async (target = process.argv[2], base = 'observed') => {
  setupFilesystem({ fileBase: `${base}/${target}` });
  addSource(`file/${target}.js`, `./${target}.js`);
  const module = await importModule(`${target}.js`);
  await module.main();
};

export const isExpected = (t, path) => {
  t.is(readFileSync(`jsxcad/observed/${path}`, { encoding: 'utf8' }),
       readFileSync(`expected/${path}`, { encoding: 'utf8' }));
};

if (process.mainModule.filename === __filename) {
  run().catch(e => {
    console.log(e.toString());
    console.log(e.stack);
  });
}
