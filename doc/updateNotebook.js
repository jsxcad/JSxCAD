import { boot, clearEmitted, getEmitted, resolvePending } from '@jsxcad/sys';
import { readFileSync, writeFileSync } from 'fs';

import api from '@jsxcad/api';
import imageDataUri from 'image-data-uri';
import pathModule from 'path';
import pixelmatch from 'pixelmatch';
import pngjs from 'pngjs';
import { screenshot } from './screenshot.js';
import { toHtml } from '@jsxcad/convert-notebook';

const writeMarkdown = (path, notebook, imageUrlList) => {
  const output = [];
  let imageCount = 0;
  let viewCount = 0;
  for (let nth = 0; nth < notebook.length; nth++) {
    const note = notebook[nth];
    const { md, view } = note;
    if (md) {
      output.push(notebook[nth].md);
    }
    if (view) {
      const imageUrl = imageUrlList[viewCount++];
      if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image/')) {
        const { dataBuffer } = imageDataUri.decode(imageUrl);
        const imagePath = `${path}.md.${imageCount++}.png`;
        writeFileSync(imagePath, dataBuffer);
        output.push(`![Image](${pathModule.basename(imagePath)})`);
      }
    }
  }

  // Produce a path back to the root.
  const roots = path.split('/');
  roots.pop();
  const root = roots.map(_ => '..').join('/');

  const markdown = output.join('\n\n').replace(/#JSxCAD@https:\/\/gitcdn.link\/cdn\/jsxcad\/JSxCAD\/master\/(.*).nb/g,
    (_, path) => `${root}/${path}.md`);

  writeFileSync(`${path}.md`, markdown);
};

export const updateNotebook = async (
  target,
  { failedExpectations = [] } = {}
) => {
  clearEmitted();
  await boot();
  try {
    await api.importModule(`${target}.nb`, { clearUpdateEmits: true });
    await resolvePending();
    const notebook = getEmitted();
    const html = await toHtml(notebook);
    writeFileSync(`${target}.html`, html);
    const { pngDataList, imageUrlList } = await screenshot(
      new TextDecoder('utf8').decode(html),
      `${target}.png`
    );
    await writeMarkdown(target, notebook, imageUrlList);
    for (let nth = 0; nth < pngDataList.length; nth++) {
      const pngData = pngDataList[nth];
      writeFileSync(`${target}_${nth}.observed.png`, pngData);
      const observedPng = pngjs.PNG.sync.read(pngData);
      let expectedPng;
      try {
        expectedPng = pngjs.PNG.sync.read(readFileSync(`${target}_${nth}.png`));
      } catch (error) {
        if (error.code === 'ENOENT') {
          // We couldn't find a matching expectation.
          failedExpectations.push(`${target}_${nth}.observed.png`);
          continue;
        } else {
          throw error;
        }
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
        // Note failures.
        failedExpectations.push(`${target}_${nth}.observed.png`);
      }
    }
  } catch (error) {
    throw error;
  }
};
