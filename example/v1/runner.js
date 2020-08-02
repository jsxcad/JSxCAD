import {
  addSource,
  boot,
  clearEmitted,
  getEmitted,
  resolvePending,
  setupFilesystem,
} from '@jsxcad/sys';
import { promises, readFileSync, writeFileSync } from 'fs';
import { toHtml } from '@jsxcad/convert-notebook';

import { importModule } from '@jsxcad/api-v1';
import { toEcmascript } from '@jsxcad/compiler';

export const run = async (target, base = 'observed') => {
  Error.stackTraceLimit = Infinity;
  clearEmitted();
  await boot();
  const start = new Date();
  setupFilesystem({ fileBase: `${base}/${target}` });
  addSource(`cache/${target}.js`, `./${target}.js`);
  await importModule(`${target}.js`);
  await resolvePending();
  const end = new Date();
  const observedTime = end - start;
  writeFileSync(`jsxcad/observed/${target}/time`, `${observedTime}`);
  writeFileSync(`observed/${target}.html`, await toHtml(getEmitted()));
  console.log(`Observed Time: ${observedTime}`);
  const expectedTime = parseInt(readFileSync(`expected/${target}/time`));
  console.log(`Expected Time: ${expectedTime}`);
  console.log(
    `Change in Time: ${((observedTime / expectedTime) * 100).toFixed(2)}%`
  );
};

export const isExpected = (t, path) => {
  t.is(
    readFileSync(`jsxcad/observed/${path}`, { encoding: 'utf8' }),
    readFileSync(`expected/${path}`, { encoding: 'utf8' })
  );
};
