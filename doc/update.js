import { argv } from 'process';
import fs from 'fs';
import path from 'path';
import { updateNotebook } from './updateNotebook.js';
import { reportTimes, watchLog } from '@jsxcad/sys';

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  process.exit(1); // mandatory (as per the Node.js docs)
});

const makePosixPath = (string) => string.split(path.sep).join(path.posix.sep);

const build = async (baseDirectory = '.') => {
  const notebookDurations = [];
  const startTime = new Date();
  const logWatcher = ({ type, source, text }) =>
    console.log(`[${type}] ${source} ${text}`);
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
      await updateNotebook(notebook, { failedExpectations });
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
      console.log(`Notebook ${notebook} completed in ${minutesDuration.toFixed(2)}.`);
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
    console.log(`Failed with error: ${error.message}`);
    console.log(error.stack);
    exitCode = 1;
  }
  process.stderr.write('', () => process.stdout.write('', () => process.exit(exitCode)));
};

build(argv[2]);
