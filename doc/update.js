import { reportTimes, watchLog } from '@jsxcad/sys';

import { argv } from 'process';
import express from 'express';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { updateNotebook } from './updateNotebook.js';

Error.stackTraceLimit = Infinity;

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  process.exit(1); // mandatory (as per the Node.js docs)
});

const server = express();
const cwd = process.cwd();
/*
const paths = [
'cgal_browser.wasm',
'jsxcad-algorithm-cgal.js',
'jsxcad-algorithm-color.js',
'jsxcad-algorithm-contour.js',
'jsxcad-algorithm-material.js',
'jsxcad-algorithm-pack.js',
'jsxcad-algorithm-text.js',
'jsxcad-algorithm-threejs.js',
'jsxcad-algorithm-tool.js',
'jsxcad-algorithm-verlet.js',
'jsxcad-api.js',
'jsxcad-api-shape.js',
'jsxcad-api-threejs.js',
'jsxcad-api-v1-armature.js',
'jsxcad-api-v1-cursor.js',
'jsxcad-api-v1-dst.js',
'jsxcad-api-v1-dxf.js',
'jsxcad-api-v1-font.js',
'jsxcad-api-v1-gcode.js',
'jsxcad-api-v1-ldraw.js',
'jsxcad-api-v1-math.js',
'jsxcad-api-v1-obj.js',
'jsxcad-api-v1-off.js',
'jsxcad-api-v1-pdf.js',
'jsxcad-api-v1-png.js',
'jsxcad-api-v1-shapefile.js',
'jsxcad-api-v1-stl.js',
'jsxcad-api-v1-svg.js',
'jsxcad-api-v1-threejs.js',
'jsxcad-api-v1-tools.js',
'jsxcad-api-v1-units.js',
'jsxcad-cache.js',
'jsxcad-compiler.js',
'jsxcad-convert-dst.js',
'jsxcad-convert-dxf.js',
'jsxcad-convert-gcode.js',
'jsxcad-convert-ldraw.js',
'jsxcad-convert-notebook.js',
'jsxcad-convert-obj.js',
'jsxcad-convert-off.js',
'jsxcad-convert-pdf.js',
'jsxcad-convert-png.js',
'jsxcad-convert-shapefile.js',
'jsxcad-convert-stl.js',
'jsxcad-convert-svg.js',
'jsxcad-convert-threejs.js',
'jsxcad-data-shape.js',
'jsxcad-geometry.js',
'jsxcad-math-line2.js',
'jsxcad-math-line3.js',
'jsxcad-math-mat4.js',
'jsxcad-math-plane.js',
'jsxcad-math-poly3.js',
'jsxcad-math-utils.js',
'jsxcad-math-vec2.js',
'jsxcad-math-vec3.js',
'jsxcad-math-vec4.js',
'jsxcad-sys.js',
'jsxcad-ui-app.js',
'jsxcad-ui-app-webworker.js',
'jsxcad-ui-notebook.js',
'jsxcad-ui-threejs.js',
'jsxcad-ui-v1.js',
'jsxcad-ui-v1-webworker.js',
];
for (const path of paths) {
  server.get(`/${path}jsxcad-api-shape.js`, (req, res) => res.sendFile(`${cwd}/es6/${path}`));
}
*/
server.use(express.static('es6'));
server.listen(5001);

const makePosixPath = (string) => string.split(path.sep).join(path.posix.sep);

const build = async (baseDirectory = '.') => {
  const browser = await puppeteer.launch({
    headless: true,
    dumpio: true,
    args: [
      '--disable-features=BlockInsecurePrivateNetworkRequests',
      '--disable-web-security',
      '--disable-features=IsolateOrigins',
      '--disable-site-isolation-trials',
    ],
  });
  const notebookDurations = [];
  const startTime = new Date();
  const logWatcher = ({ type, source, text }) => {
    console.log(`[${type}] ${source} ${text}`);
  };
  let exitCode;
  watchLog(logWatcher);
  try {
    const notebooks = [];
    const walk = async (directory) => {
      for (const entry of await fs.promises.readdir(directory, {
        withFileTypes: true,
      })) {
        if (['node_modules'].includes(entry.name)) {
          continue;
        }
        const filepath = makePosixPath(path.join(directory, entry.name));
        if (entry.isDirectory()) {
          await walk(filepath);
        } else if (entry.isFile()) {
          if (filepath.endsWith('.nb')) {
            notebooks.push(filepath.substring(0, filepath.length - 3));
          }
        }
      }
    };
    await walk(baseDirectory);
    const collectedFailedExpectations = [];
    for (const notebook of notebooks) {
      const startTime = new Date();
      const failedExpectations = [];
      console.log(`Processing notebook: ${process.cwd()}/${notebook}.nb`);
      await updateNotebook(notebook, { failedExpectations, browser });
      if (
        failedExpectations.length > 0 &&
        collectedFailedExpectations.length > 0
      ) {
        collectedFailedExpectations.push('');
      }
      collectedFailedExpectations.push(...failedExpectations);
      const finishTime = new Date();
      const minutesDuration = (finishTime - startTime) / 60000.0;
      notebookDurations.push({ notebook, minutesDuration });
      console.log(
        `Notebook ${notebook} completed in ${minutesDuration.toFixed(2)}.`
      );
    }
    reportTimes();
    notebookDurations.sort((a, b) => a.minutesDuration - b.minutesDuration);
    for (const { notebook, minutesDuration } of notebookDurations) {
      console.log(`Completed ${notebook} in ${minutesDuration.toFixed(2)}.`);
    }
    const finishTime = new Date();
    const minutesDuration = (finishTime - startTime) / 60000.0;
    console.log(`Total time ${minutesDuration.toFixed(2)}.`);
    if (collectedFailedExpectations.length > 0) {
      console.log('Expectations failed:');
      for (const failedExpectation of collectedFailedExpectations) {
        console.log(failedExpectation);
      }
      exitCode = 1;
    } else {
      console.log('Completed successfully');
      exitCode = 0;
    }
  } catch (error) {
    console.log(`ER/1: ${JSON.stringify(error)}`);
    console.log(`Failed with error: ${error.message}`);
    console.log(error.stack);
    exitCode = 1;
  }
  await browser.close();
  process.stderr.write('', () =>
    process.stdout.write('', () => process.exit(exitCode))
  );
};

build(argv[2]);
