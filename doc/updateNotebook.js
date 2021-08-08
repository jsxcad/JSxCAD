import {
  boot,
  clearEmitted,
  getEmitted,
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
  console.log(`QQ/updateNotebook ${target}`);
  clearEmitted();
  await boot();
  try {
    await api.importModule(`${target}.nb`);
  } catch (error) {
    api.log(error.stack);
  }
  await resolvePending();
  const notebook = getEmitted();
  const html = await toHtml(notebook);
  console.log(`QQ/writeHtml ${target}.html`);
  writeFileSync(`${target}.html`, html);
  const { pngDataList, imageUrlList } = await screenshot(
    new TextDecoder('utf8').decode(html),
    `${target}.png`
  );
  console.log(`QQ/writeMarkdown`);
  await writeMarkdown(target, notebook, imageUrlList);
  console.log(`QQ/writePng`);
  for (let nth = 0; nth < pngDataList.length; nth++) {
    const pngData = pngDataList[nth];
    writeFileSync(`${target}_${nth}.observed.png`, pngData);
    const observedPng = pngjs.PNG.sync.read(pngData);
    let expectedPng;
    try {
      expectedPng = pngjs.PNG.sync.read(readFileSync(`${target}_${nth}.png`));
    } catch (error) {
      if (error.code === 'ENOENT') {
        // We have no expectation -- generate one.
        const buffer = pngjs.PNG.sync.write(observedPng);
        writeFileSync(`${target}_${nth}.png`, buffer);
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
        `${target}_${nth}.difference.png`,
        pngjs.PNG.sync.write(differencePng)
      );
    }
  }
};
