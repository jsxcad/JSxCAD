import { boot, clearEmitted, getEmitted, resolvePending } from '@jsxcad/sys';
import { readFileSync, writeFileSync } from 'fs';
import { importModule } from '@jsxcad/api-v1';
import pixelmatch from 'pixelmatch';
import pngjs from 'pngjs';
import { screenshot } from './screenshot.js';
import { toHtml } from '@jsxcad/convert-notebook';

export const updateNotebook = async (target) => {
  console.log(`updateNotebook: ${target}`);
  const width = 512;
  const height = 2048;
  clearEmitted();
  await boot();
  await importModule(`${target}.nb`);
  await resolvePending();
  const html = await toHtml(getEmitted());
  writeFileSync(`${target}.html`, html);
  const { pngData } = await screenshot(
    new TextDecoder('utf8').decode(html),
    `${target}.png`,
    { width, height }
  );
  writeFileSync(`${target}.observed.png`, pngData);
  const observedPng = pngjs.PNG.sync.read(pngData);
  let expectedPng;
  try {
    expectedPng = pngjs.PNG.sync.read(readFileSync(`${target}.png`));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    writeFileSync(`${target}.png`, pngData);
    return;
  }
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
  if (numFailedPixels >= pixelThreshold) {
    throw Error('die');
  }
};