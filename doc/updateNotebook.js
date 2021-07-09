import {
  boot,
  clearEmitted,
  getEmitted,
  read,
  resolvePending,
} from '@jsxcad/sys';
import { readFileSync, writeFileSync } from 'fs';

import api from '@jsxcad/api';
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
  console.log(`QQ/updateNotebook/0`);
  clearEmitted();
  await boot();
  console.log(`QQ/updateNotebook/1`);
  try {
    await api.importModule(`${target}.nb`);
  } catch (error) {
    console.log(`QQ/updateNotebook/1/error`);
    api.log(error.stack);
  }
  console.log(`QQ/updateNotebook/2`);
  await resolvePending();
  const notebook = getEmitted();
  for (const note of notebook) {
    if (note.log) {
      console.log(note.log.text);
    }
    if (note.path) {
      note.data = await read(note.path);
    }
  }
  console.log(`QQ/updateNotebook/3`);
  const html = await toHtml(notebook);
  console.log(`QQ/updateNotebook/4`);
  writeFileSync(`${target}.html`, html);
  console.log(`QQ/updateNotebook/5`);
  const { pngData, imageUrls } = await screenshot(
    new TextDecoder('utf8').decode(html),
    `${target}.png`
  );
  console.log(`QQ/updateNotebook/6`);
  await writeMarkdown(target, notebook, imageUrls);
  writeFileSync(`${target}.observed.png`, pngData);
  const observedPng = pngjs.PNG.sync.read(pngData);
  let expectedPng;
  console.log(`QQ/updateNotebook/7`);
  try {
    expectedPng = pngjs.PNG.sync.read(readFileSync(`${target}.png`));
  } catch (error) {
    if (error.code === 'ENOENT') {
      // We have no expectation -- generate one.
      const buffer = pngjs.PNG.sync.write(observedPng);
      writeFileSync(`${target}.png`, buffer);
      return;
    }
    throw error;
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
      threshold: 0.01,
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
    console.log(`${process.cwd()}/${target}.difference.png`);
  }
};
