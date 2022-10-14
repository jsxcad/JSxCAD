import {
  addOnEmitHandler,
  boot,
  clearEmitted,
  read,
  removeOnEmitHandler,
  resolvePending,
  setNotifyFileReadEnabled,
  setupFilesystem,
  unwatchFileRead,
  watchFileRead,
} from '@jsxcad/sys';
import { readFileSync, writeFileSync } from 'fs';
import {
  toHtmlFromNotebook,
  toStandaloneFromScript,
} from '@jsxcad/convert-notebook';

import Base64ArrayBuffer from 'base64-arraybuffer';
import api from '@jsxcad/api';
import imageDataUri from 'image-data-uri';
import pathModule from 'path';
import pixelmatch from 'pixelmatch';
import pngjs from 'pngjs';
import { screenshot } from './screenshot.js';

const IGNORED_PIXEL_THRESHOLD_OBSERVED_PATHS = new Set([
  'nb/regression/shapes/shapes.md.10.observed.png',
  'nb/regression/shapes/shapes.md.56.observed.png',
  'nb/regression/shapes/shapes.md.57.observed.png',
  'nb/regression/smooth/smooth.md.3.observed.png',
]);
const PIXEL_THRESHOLD = 3000;

const ensureNewline = (line) => (line.endsWith('\n') ? line : `${line}\n`);

const escapeMarkdownLink = (string) => string.replace(/ /g, '%20');

const writeMarkdown = async (
  modulePath,
  notebook,
  imageUrlList,
  failedExpectations,
  workspace
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
      for (let { base64Data, filename, data, path } of entries) {
        if (!data && base64Data) {
          data = new Uint8Array(Base64ArrayBuffer.decode(base64Data));
        }
        if (!data) {
          data = await read(path, { workspace });
        }
        const observedPath = `${modulePath}.observed.${filename}`;
        const expectedPath = `${modulePath}.${filename}`;
        if (!filename.endsWith('stl')) {
          // STL output has become unstable; skip for now.
          try {
            const observed = new TextDecoder('utf8').decode(data);
            const expected = readFileSync(expectedPath, 'utf8');
            if (observed !== expected) {
              failedExpectations.push(`cp "${observedPath}" "${expectedPath}"`);
            }
          } catch (error) {
            console.log(`EE/3: ${JSON.stringify(error)}`);
            if (error.code === 'ENOENT') {
              failedExpectations.push(`cp "${observedPath}" "${expectedPath}"`);
              failedExpectations.push(`git add "${expectedPath}"`);
            } else {
              throw error;
            }
          }
        }
        output.push(
          `[${filename}](${escapeMarkdownLink(
            pathModule.basename(expectedPath)
          )})`
        );
        output.push('');
        try {
          writeFileSync(observedPath, data);
        } catch (e) {
          console.log(`QQ/entries: ${JSON.stringify(entries)}`);
          throw e;
        }
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
      /#https:\/\/raw.githubusercontent.com\/jsxcad\/JSxCAD\/master\/(.*).nb/g,
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
    console.log(`EE/0: ${JSON.stringify(error)}`);
    if (error.code === 'ENOENT') {
      failedExpectations.push(`cp "${observedPath}" "${expectedPath}"`);
      failedExpectations.push(`git add "${expectedPath}"`);
    } else {
      throw error;
    }
  }
};

const sortNotebook = (notebook) => {
    const getLine = (note) => {
      if (note.sourceLocation) {
        return note.sourceLocation.line;
      } else {
        return 0;
      }
    };
    const getNth = (note) => {
      if (note.sourceLocation) {
        return note.sourceLocation.nth;
      } else {
        return 0;
      }
    };
    const order = (a, b) => {
      const lineA = getLine(a);
      const lineB = getLine(b);
      if (lineA !== lineB) {
        return lineA - lineB;
      }
      const nthA = getNth(a);
      const nthB = getNth(b);
      return nthA - nthB;
    };
    notebook.sort(order);
};


const toSourceFromName = (baseDirectory) => (name) => {
  const prefix = 'https://raw.githubusercontent.com/jsxcad/JSxCAD/master/';
  if (name.startsWith(prefix)) {
    return name.substring(prefix.length);
  }
  return name;
};

export const updateNotebook = async (
  target,
  { failedExpectations = [], browser, baseDirectory, workspace } = {}
) => {
  clearEmitted();
  await boot();
  const notebook = [];
  const onEmitHandler = addOnEmitHandler((notes) => notebook.push(...notes));
  const files = {};
  const addFile = async (path, workspace) => {
    if (files[path] || !path.startsWith('source/')) {
      return;
    }
    const data = await read(path, {
      workspace,
      ephemeral: true,
      notifyFileReadEnabled: false,
    });
    files[path] = data;
  };
  let fileReadWatcher = watchFileRead(addFile);
  try {
    // FIX: This may produce a non-deterministic ordering for now.
    const module = `${target}.nb`;
    const topLevel = new Map();
    // FIX: Sort out top-level evaluation vs module caching.
    api.setToSourceFromNameFunction(toSourceFromName(baseDirectory));
    setupFilesystem({ fileBase: workspace });
    setNotifyFileReadEnabled(true);
    console.log(`QQ/updateNotebook: module=${module}`);
    await api.importModule(module, {
      clearUpdateEmits: false,
      topLevel,
      readCache: false,
      workspace,
    });
    await resolvePending();
    sortNotebook(notebook);
    const { html, encodedNotebook } = await toHtmlFromNotebook(notebook, {
      module,
      modulePath: 'http://127.0.0.1:5001',
    });
    const { imageUrlList } = await screenshot(
      new TextDecoder('utf8').decode(html),
      { browser }
    );
    {
      // Build a version for jsxcad.js.org/nb/
      const { html } = await toStandaloneFromScript({
        module,
        files,
        modulePath: 'https://jsxcad.js.org/alpha',
        useMermaid: true,
        useControls: true,
      });
      writeFileSync(`${target}.html`, html);
    }
    await writeMarkdown(
      target,
      encodedNotebook,
      imageUrlList,
      failedExpectations,
      workspace
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
        console.log(`EE/1: ${JSON.stringify(error)}`);
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
      if (
        numFailedPixels > PIXEL_THRESHOLD &&
        !IGNORED_PIXEL_THRESHOLD_OBSERVED_PATHS.has(observedPath)
      ) {
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
    console.log(`EE/2: ${JSON.stringify(error)}`);
    console.log(error.stack);
    throw error;
  } finally {
    removeOnEmitHandler(onEmitHandler);
    unwatchFileRead(fileReadWatcher);
  }
};
