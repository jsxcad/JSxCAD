import {
  clearFileCache,
  getTimes,
  reportTimes,
  setLocalFilesystem,
  watchLog,
} from '@jsxcad/sys';

import { argv } from 'process';
import { clearMeshCache } from '@jsxcad/algorithm-cgal';
import express from 'express';
import fs from 'fs';
import path from 'path';
// import puppeteer from 'puppeteer';
import { updateNotebook } from './updateNotebook.js';

Error.stackTraceLimit = Infinity;

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  process.exit(1); // mandatory (as per the Node.js docs)
});

const server = express();
const cwd = process.cwd();
server.use(express.static('es6'));
server.listen(5001);

const makePosixPath = (string) => string.split(path.sep).join(path.posix.sep);

const processArgs = (args) => {
  // const isNoHtml = args.includes('--nohtml');
  const isQuiet = args.includes('--quiet');
  const last = args[args.length - 1];
  const baseDirectory = last && !last.startsWith('--') ? last : '.';
  return { isQuiet, baseDirectory };
};

const build = async (...args) => {
  const { isQuiet, baseDirectory } = processArgs(args.filter((arg) => arg));
  /*
  const browser = isNoHtml
    ? undefined
    : await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-features=BlockInsecurePrivateNetworkRequests',
          '--disable-web-security',
          '--disable-features=IsolateOrigins',
          '--disable-site-isolation-trials',
          '--js-flags="--experimental-wasm-eh"',
        ],
      });
  */
  const notebookDurations = [];
  const startTime = new Date();
  setLocalFilesystem(
    'https://raw.githubusercontent.com/jsxcad/JSxCAD/master/',
    cwd
  );
  const logWatcher = ({ type, source, text }) => {
    if (type === 'info' && isQuiet) {
      return;
    }
    console.log(`[${type}] ${source} ${text}`);
  };
  let exitCode;
  watchLog(logWatcher);
  try {
    const notebooks = [];
    const walk = async (current) => {
      if (current.endsWith('.nb')) {
        notebooks.push(current.substring(0, current.length - 3));
        return;
      }
      for (const entry of await fs.promises.readdir(current, {
        withFileTypes: true,
      })) {
        if (['node_modules', 'jsxcad'].includes(entry.name)) {
          continue;
        }
        const filepath = makePosixPath(path.join(current, entry.name));
        if (entry.isDirectory()) {
          await walk(filepath);
        } else if (entry.isFile()) {
          if (filepath.endsWith('.nb')) {
            await walk(filepath);
          }
        }
      }
    };
    await walk(baseDirectory);
    const collectedFailedExpectations = [];
    for (const notebook of notebooks) {
      const startTime = new Date();
      const failedExpectations = [];
      console.log(`Processing notebook: ${cwd}/${notebook}.nb`);
      await updateNotebook(notebook, {
        failedExpectations,
        // browser,
        baseDirectory,
        workspace: notebook.replace(/[/]/g, '_'),
      });
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
      clearFileCache();
      clearMeshCache();
    }
    reportTimes();
    notebookDurations.sort((a, b) => a.minutesDuration - b.minutesDuration);
    for (const { notebook, minutesDuration } of notebookDurations) {
      console.log(`Completed ${notebook} in ${minutesDuration.toFixed(2)}.`);
    }
    const finishTime = new Date();
    const minutesDuration = (finishTime - startTime) / 60000.0;
    console.log(`Total time ${minutesDuration.toFixed(2)}.`);
    {
      // Print out the operation level profile.
      console.log('Profile');
      const entries = getTimes();
      entries.sort(
        ([aName, aEntry], [bName, bEntry]) => aEntry.total - bEntry.total
      );
      for (const [name, entry] of entries) {
        const { total } = entry;
        console.log(`${name} ${total.toFixed(2)}`);
      }
    }
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
  // if (browser) { await browser.close(); }
  process.stderr.write('', () =>
    process.stdout.write('', () => process.exit(exitCode))
  );
};

build(argv[2], argv[3]);
