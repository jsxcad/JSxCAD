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
import pathModule from 'path';
import pixelmatch from 'pixelmatch';
import pngjs from 'pngjs';
import { renderPng } from '@jsxcad/convert-threejs';

const IGNORED_PIXEL_THRESHOLD_OBSERVED_PATHS = new Set([
  'nb/api/Orb.md.$5_2.observed.png',
  'nb/api/image.md.$2.observed.png',
  'nb/api/iron.md.$2.observed.png',
  'nb/api/minimizeOverhang.md.$2.observed.png',
  'nb/api/route.md.path.observed.png',
  'nb/api/smooth.md.$4.observed.png',
  'nb/projects/pentacular/micro_gear_motor/examples.md.$1_motor_case.observed.png',
  'nb/regression/smooth/smooth.md.simplified_1.observed.png',
  'nb/regression/shape/shape.md.$50.observed.png',
  'nb/regression/shape_2/shape_2.md.$5.observed.png',
  'nb/regression/shapes/shapes.md.$11.observed.png',
  'nb/regression/shapes/shapes.md.$55.observed.png',
  'nb/regression/shapes/shapes.md.$56.observed.png',
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
  for (let nth = 0; nth < notebook.length; nth++) {
    const note = notebook[nth];
    const { md, sourceText, view } = note;
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
      const pathViewId = view.viewId.replace(/[/]/g, '_');
      const imagePath = `${modulePath}.md.${pathViewId}.png`;
      output.push(`![Image](${pathModule.basename(imagePath)})`);
      output.push('');
      const { download } = view;
      if (download) {
        const { entries } = download;
        for (let { base64Data, filename, data, path } of entries) {
          console.log(`QQ/download: filename=${filename} path=${path}`);
          if (!data && base64Data) {
            data = new Uint8Array(Base64ArrayBuffer.decode(base64Data));
          }
          if (!data) {
            data = await read(path, { workspace });
          }
          const observedPath = `${modulePath}.observed.${filename}`;
          const expectedPath = `${modulePath}.${filename}`;
          if (!filename.endsWith('stl') && !filename.endsWith('pdf')) {
            // STL output has become unstable; skip for now.
            try {
              const observed = new TextDecoder('utf8').decode(data);
              const expected = readFileSync(expectedPath, 'utf8');
              if (observed !== expected) {
                failedExpectations.push(
                  `cp '${observedPath}' '${expectedPath}'`
                );
              }
            } catch (error) {
              console.log(`EE/3: ${JSON.stringify(error)}`);
              if (error.code === 'ENOENT') {
                failedExpectations.push(
                  `cp '${observedPath}' '${expectedPath}'`
                );
                failedExpectations.push(`git add '${expectedPath}'`);
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
      failedExpectations.push(`cp '${observedPath}' '${expectedPath}'`);
    }
  } catch (error) {
    console.log(`EE/0: ${JSON.stringify(error)}`);
    if (error.code === 'ENOENT') {
      failedExpectations.push(`cp '${observedPath}' '${expectedPath}'`);
      failedExpectations.push(`git add '${expectedPath}'`);
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
  if (target.startsWith('nb/projects/pentacular/plots/')) {
    console.log(`QQ/FIXME: skipping ${target}`);
    return;
  }
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
    console.log('');
    console.log('---');
    console.log('');
    console.log(`QQ/updateNotebook: module=${module}`);
    await api.importModule(module, {
      clearUpdateEmits: false,
      topLevel,
      readCache: false,
      workspace,
    });
    await resolvePending();
    sortNotebook(notebook);
    for (const note of notebook) {
      if (note.error) {
        throw new Error(note.error.text);
      }
    }
    const { encodedNotebook } = await toHtmlFromNotebook(notebook, {
      module,
      modulePath: 'http://127.0.0.1:5001',
    });
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
    const imageUrlList = [];
    for (const note of notebook) {
      const { path, view } = note;
      if (view) {
        const { viewId } = view;
        const geometry = await read(path, { workspace });
        const png = await renderPng(
          { geometry, view },
          { offsetWidth: view.width, offsetHeight: view.height }
        );
        const pathViewId = viewId.replace(/[/]/g, '_');
        const observedPath = `${target}.md.${pathViewId}.observed.png`;
        const expectedPath = `${target}.md.${pathViewId}.png`;
        writeFileSync(observedPath, new Uint8Array(png));
        const observedPng = pngjs.PNG.sync.read(Buffer.from(png));
        let expectedPng;
        try {
          expectedPng = pngjs.PNG.sync.read(readFileSync(expectedPath));
        } catch (error) {
          console.log(`EE/1: ${JSON.stringify(error)}`);
          if (error.code === 'ENOENT') {
            // We couldn't find a matching expectation.
            failedExpectations.push(`cp '${observedPath}' '${expectedPath}'`);
            failedExpectations.push(`git add '${expectedPath}'`);
            continue;
          } else {
            throw error;
          }
        }
        const { width, height } = expectedPng;
        if (width !== observedPng.width || height !== observedPng.height) {
          // Can't diff when the dimensions don't match.
          failedExpectations.push('# dimensions differ');
          failedExpectations.push(`cp '${observedPath}' '${expectedPath}'`);
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
          const differencePath = `${target}.md.${pathViewId}.difference.png`;
          writeFileSync(differencePath, pngjs.PNG.sync.write(differencePng));
          // Note failures.
          failedExpectations.push(
            `# numFailedPixels ${numFailedPixels} > PIXEL_THRESHOLD ${PIXEL_THRESHOLD}`
          );
          failedExpectations.push(`display '${differencePath}'`);
          failedExpectations.push(`cp '${observedPath}' '${expectedPath}'`);
        }
      }
    }
    await writeMarkdown(
      target,
      encodedNotebook,
      imageUrlList,
      failedExpectations,
      workspace
    );
  } catch (error) {
    console.log(`EE/2: ${JSON.stringify(error)}`);
    console.log(error.stack);
    throw error;
  } finally {
    removeOnEmitHandler(onEmitHandler);
    unwatchFileRead(fileReadWatcher);
  }
};
