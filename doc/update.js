import { argv } from 'process';
import fs from 'fs';
import path from 'path';
import { updateNotebook } from './updateNotebook.js';

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  process.exit(1); // mandatory (as per the Node.js docs)
});

const makePosixPath = (string) => string.split(path.sep).join(path.posix.sep);

const build = async (baseDirectory = '.') => {
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
    const failedExpectations = [];
    for (const notebook of notebooks) {
      console.log(`Processing notebook: ${process.cwd()}/${notebook}.nb`);
      await updateNotebook(notebook, { failedExpectations });
    }
    if (failedExpectations.length > 0) {
      console.log('Expectations failed:');
      for (const failedExpectation of failedExpectations) {
        console.log(failedExpectation);
      }
      process.exit(1);
    }
  } catch (error) {
    console.log('Failed with error');
    console.log(error.stack);
    process.exit(1);
  }
  console.log('Completed successfully');
  process.exit(0);
};

build(argv[2]);
