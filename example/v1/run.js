import { promises, readFileSync } from 'fs';

import argv from 'argv';
import { importModule } from '@jsxcad/api-v1';
import { setupFilesystem } from '@jsxcad/sys';
import { toEcmascript } from '@jsxcad/compiler';

const { readFile } = promises;

export const run = async (target = process.argv[2], base = 'observed') => {
  setupFilesystem({ fileBase: `${base}/${target}` });
  const module = await importModule('script', `${target}.js`);
  await module.main();
};

export const isExpected = (t, path) => {
  t.is(readFileSync(`observed/${path}`, { encoding: 'utf8' }),
       readFileSync(`expected/${path}`, { encoding: 'utf8' }));
};

if (module.parent === undefined) {
  run().catch(e => {
    console.log(e.toString());
    console.log(e.stack);
  });
}
