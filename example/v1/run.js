import { promises, readFileSync } from 'fs';

import argv from 'argv';
import { importModule } from '@jsxcad/api-v1';
import { setupFilesystem } from '@jsxcad/sys';
import { toEcmascript } from '@jsxcad/compiler';

const { readFile } = promises;

export const run = async (target = process.argv[2], base = 'observed') => {
console.log(`target: ${target}`);
  setupFilesystem({ fileBase: `${base}/${target}` });
  const module = await importModule('script', `${target}.js`);
  await module.main();
};

export const isExpected = (t, path) => {
  t.is(readFileSync(`observed/${path}`, { encoding: 'utf8' }),
       readFileSync(`expected/${path}`, { encoding: 'utf8' }));
};

console.log(`QQ/1`);
// if (module.parent === undefined) {
if (process.mainModule.filename === __filename) {
console.log(`QQ/2`);
  run().catch(e => {
    console.log(e.toString());
    console.log(e.stack);
  });
}
console.log(`QQ/3`);
