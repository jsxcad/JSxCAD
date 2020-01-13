import { addSource, setupFilesystem } from '@jsxcad/sys';
import { promises, readFileSync, writeFileSync } from 'fs';

import argv from 'argv';
import { importModule } from '@jsxcad/api-v1';
import { toEcmascript } from '@jsxcad/compiler';

export const run = async (target = process.argv[2], base = 'observed') => {
  const start = new Date();
  setupFilesystem({ fileBase: `${base}/${target}` });
  addSource(`cache/${target}.js`, `./${target}.js`);
  const module = await importModule(`${target}.js`);
  await module.main();
  const end = new Date();
  const observedTime = end - start;
  writeFileSync(`jsxcad/observed/${target}/time`, `${observedTime}`);
  console.log(`Observed Time: ${observedTime}`);
  const expectedTime = parseInt(readFileSync(`expected/${target}/time`));
  console.log(`Expected Time: ${expectedTime}`);
  console.log(`Change in Time: ${(observedTime / expectedTime * 100).toFixed(2)}%`);
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
