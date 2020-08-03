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
import { screenshot } from './screenshot.js';
import pngjs from 'pngjs';
import pixelmatch from 'pixelmatch';

export const run = async (target, base = 'observed') => {
  const width = 512;
  const height = 2048;
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
  const html = await toHtml(getEmitted());
  writeFileSync(`observed/${target}.html`, html);
  const capture = await screenshot(
    new TextDecoder('utf8').decode(html),
    `observed/${target}.png`,
    { width, height }
  );
  writeFileSync(`observed/${target}.png`, capture);
  const observedPng = pngjs.PNG.sync.read(capture);
  const expectedPng = pngjs.PNG.sync.read(
    readFileSync(`expected/${target}.png`)
  );
  const differencePng = new pngjs.PNG({ width, height });
  const pixelThreshold = 1;
  const numFailedPixels = pixelmatch(
    expectedPng.data,
    observedPng.data,
    differencePng.data,
    width,
    height,
    {
      threshold: pixelThreshold,
      alpha: 0.2,
      diffMask: process.env.FORCE_COLOR === '0',
      diffColor:
        process.env.FORCE_COLOR === '0' ? [255, 255, 255] : [255, 0, 0],
    }
  );
  console.log(`E`);
  if (numFailedPixels >= pixelThreshold) {
    throw Error('die');
  }
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
