import {
  addOnEmitHandler,
  boot,
  clearEmitted,
  removeOnEmitHandler,
  resolvePending,
} from '@jsxcad/sys';
import { readFileSync, writeFileSync } from 'fs';

import Base64ArrayBuffer from 'base64-arraybuffer';
import api from '@jsxcad/api';
import imageDataUri from 'image-data-uri';
import pathModule from 'path';
import pixelmatch from 'pixelmatch';
import pngjs from 'pngjs';
import { screenshot } from './screenshot.js';
import { toHtml } from '@jsxcad/convert-notebook';

const PIXEL_THRESHOLD = 2000;

const ensureNewline = (line) => (line.endsWith('\n') ? line : `${line}\n`);

const escapeMarkdownLink = (string) => string.replace(/ /g, '%20');

const writeMarkdown = async (
  modulePath,
  notebook,
  imageUrlList,
  failedExpectations
) => {
  const output = [];
  let imageCount = 0;
  let viewCount = 0;
  for (let nth = 0; nth < notebook.length; nth++) {
    const note = notebook[nth];
    const { download, md, sourceText, view } = note;
    if (md) {
      output.push(ensureNewline(notebook[nth].md.trim()));
    }
    if (sourceText) {
      if (!sourceText.startsWith('md`')) {
        output.push('```JavaScript');
        output.push(sourceText);
        output.push('```');
        output.push('');
      }
    }
    if (view) {
      const imageUrl = imageUrlList[viewCount++];
      if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image/')) {
        const imagePath = `${modulePath}.md.${imageCount++}.png`;
        output.push(`![Image](${pathModule.basename(imagePath)})`);
        output.push('');
      }
    }
    if (download) {
      const { entries } = download;
      for (let { base64Data, filename, data } of entries) {
        if (!data && base64Data) {
          data = new Uint8Array(Base64ArrayBuffer.decode(base64Data));
        }
        const observedPath = `${modulePath}.observed.${filename}`;
        const expectedPath = `${modulePath}.${filename}`;
        try {
          const observed = new TextDecoder('utf8').decode(data);
          const expected = readFileSync(expectedPath, 'utf8');
          if (observed !== expected) {
            failedExpectations.push(`cp "${observedPath}" "${expectedPath}"`);
          }
        } catch (error) {
          if (error.code === 'ENOENT') {
            failedExpectations.push(`cp "${observedPath}" "${expectedPath}"`);
            failedExpectations.push(`git add "${expectedPath}"`);
          }
        }
        output.push(
          `[${filename}](${escapeMarkdownLink(
            pathModule.basename(expectedPath)
          )})`
        );
        output.push('');
        writeFileSync(observedPath, data);
      }
    }
  }

  // Produce a path back to the root.
  const roots = modulePath.split('/');
  roots.pop();
  const root = roots.map((_) => '..').join('/');

  const markdown = output
    .join('\n')
    .replace(
      /#JSxCAD@https:\/\/gitcdn.link\/cdn\/jsxcad\/JSxCAD\/master\/(.*).nb/g,
      (_, modulePath) => `${root}/${modulePath}.md`
    );

  const observedPath = `${modulePath}.observed.md`;
  const expectedPath = `${modulePath}.md`;
  writeFileSync(observedPath, markdown);
  try {
    if (markdown !== readFileSync(expectedPath, 'utf8')) {
      failedExpectations.push(`cp "${observedPath}" "${expectedPath}"`);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      failedExpectations.push(`cp "${observedPath}" "${expectedPath}"`);
      failedExpectations.push(`git add "${expectedPath}"`);
    } else {
      throw error;
    }
  }
};

export const updateNotebook = async (
  target,
  { failedExpectations = [] } = {}
) => {
  clearEmitted();
  await boot();
  const notebook = [];
  const onEmitHandler = addOnEmitHandler((notes) => notebook.push(...notes));
  try {
    // FIX: This may produce a non-deterministic ordering for now.
    const module = `${target}.nb`;
    const topLevel = new Map();
    await api.importModule(module, { clearUpdateEmits: false, topLevel });
    await resolvePending();
    const { html, encodedNotebook } = await toHtml(notebook, { module });
    writeFileSync(`${target}.html`, html);
    const { imageUrlList } = await screenshot(
      new TextDecoder('utf8').decode(html),
      `${target}.png`
    );
    await writeMarkdown(
      target,
      encodedNotebook,
      imageUrlList,
      failedExpectations
    );
    for (let nth = 0; nth < imageUrlList.length; nth++) {
      const observedPath = `${target}.md.${nth}.observed.png`;
      const expectedPath = `${target}.md.${nth}.png`;
      const { dataBuffer } = imageDataUri.decode(imageUrlList[nth]);
      writeFileSync(observedPath, dataBuffer);
      const observedPng = pngjs.PNG.sync.read(dataBuffer);
      let expectedPng;
      try {
        expectedPng = pngjs.PNG.sync.read(readFileSync(expectedPath));
      } catch (error) {
        if (error.code === 'ENOENT') {
          // We couldn't find a matching expectation.
          failedExpectations.push(`cp "${observedPath}" "${expectedPath}"`);
          failedExpectations.push(`git add "${expectedPath}"`);
          continue;
        } else {
          throw error;
        }
      }
      const { width, height } = expectedPng;
      if (width !== observedPng.width || height !== observedPng.height) {
        // Can't diff when the dimensions don't match.
        failedExpectations.push('# dimensions differ');
        failedExpectations.push(`cp "${observedPath}" "${expectedPath}"`);
        continue;
      }
      const differencePng = new pngjs.PNG({ width, height });
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
      if (numFailedPixels >= PIXEL_THRESHOLD) {
        const differencePath = `${target}.md.${nth}.difference.png`;
        writeFileSync(differencePath, pngjs.PNG.sync.write(differencePng));
        // Note failures.
        failedExpectations.push(
          `# numFailedPixels ${numFailedPixels} > PIXEL_THRESHOLD ${PIXEL_THRESHOLD}`
        );
        failedExpectations.push(`display "${differencePath}"`);
        failedExpectations.push(`cp "${observedPath}" "${expectedPath}"`);
      }
    }
  } catch (error) {
    throw error;
  } finally {
    removeOnEmitHandler(onEmitHandler);
  }
};
