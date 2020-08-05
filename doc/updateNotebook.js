import { boot, clearEmitted, getEmitted, resolvePending } from '@jsxcad/sys';
import { importModule, log } from '@jsxcad/api-v1';
import { readFileSync, writeFileSync } from 'fs';

import imageDataUri from 'image-data-uri';
import pathModule from 'path';
import pixelmatch from 'pixelmatch';
import pngjs from 'pngjs';
import { screenshot } from './screenshot.js';
import { toHtml } from '@jsxcad/convert-notebook';

const writeMarkdown = (path, notebook, imageUrls) => {
  const md = [];
  let imageCount = 0;
  for (let nth = 0; nth < notebook.length; nth++) {
    if (notebook[nth].md) {
      md.push(notebook[nth].md);
    }
    if (imageUrls[nth]) {
      imageCount += 1;
      const { dataBuffer } = imageDataUri.decode(imageUrls[nth]);
      const imagePath = `${path}.md.${imageCount}.png`;
      writeFileSync(imagePath, dataBuffer);
      md.push(`![Image](${pathModule.basename(imagePath)})`);
    }
  }
  writeFileSync(`${path}.md`, md.join('\n'));
};

export const updateNotebook = async (target) => {
  console.log(`updateNotebook: ${target}`);
  clearEmitted();
  await boot();
  try {
    await importModule(`${target}.nb`);
  } catch (error) {
    log(error.toString());
  }
  await resolvePending();
  const notebook = getEmitted();
  const html = await toHtml(notebook);
  writeFileSync(`${target}.html`, html);
  const { pngData, imageUrls } = await screenshot(
    new TextDecoder('utf8').decode(html),
    `${target}.png`
  );
  await writeMarkdown(target, notebook, imageUrls);
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
  const { width, height } = expectedPng;
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
    writeFileSync(
      `${target}.difference.png`,
      pngjs.PNG.sync.write(differencePng)
    );
    throw Error('die');
  }
};
